import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import mqtt from 'mqtt';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { EncryptService } from './encrypt.service';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MqttService {
  private client!: mqtt.MqttClient;
  private mqttUrl = environment.mqttUrl;
  private baseTopic : string = "";
  private devicesSubject = new BehaviorSubject<any[]>([]);
  private groupsSubject = new BehaviorSubject<any[]>([]);
  private stateSubject = new BehaviorSubject<boolean>(false);
  private deviceStateSubject = new BehaviorSubject<Map<string, boolean>>(new Map());
  private topicSubscriptions: Set<string> = new Set();
  private topicCallbackMap: { [key: string]: { property: string, callback: Function }[] } = {};
  private countdownSubject = new BehaviorSubject<number>(0);
  public countdown$ = this.countdownSubject.asObservable();

  constructor(private router: Router, private encryptService: EncryptService) {
    this.checkStoredCredentials();
  }

  public logout(){
    this.devicesSubject = new BehaviorSubject<any[]>([]);
    this.groupsSubject = new BehaviorSubject<any[]>([]);
    this.stateSubject = new BehaviorSubject<boolean>(false);
    this.deviceStateSubject = new BehaviorSubject<Map<string, boolean>>(new Map());
    this.topicSubscriptions = new Set();
    this.topicCallbackMap = {};
    this.countdownSubject = new BehaviorSubject<number>(0);
    this.countdown$ = this.countdownSubject.asObservable();
    this.disconnectFromBroker();
  }

  private checkStoredCredentials() {
    const credentials = this.encryptService.getCredentials();

    const localBroker = sessionStorage.getItem('mqttBroker');
    const localBasicTopic = sessionStorage.getItem('mqttBasicTopic');

    if(localBroker&&localBasicTopic){
      this.mqttUrl=localBroker;
      this.baseTopic=localBasicTopic;
    } else if(credentials!=null) {
      this.setCloudBroker(credentials.username);
    } else {
      this.logout();
    }

    if (credentials) {
      this.connectToBroker(credentials.username, credentials.password).then(isConnected => {
        if (isConnected) {
          console.log('Reconnected to MQTT broker.');
          this.router.navigate(['/']);
        } else {
          console.warn('Reconnection failed, prompting for login.');
        }
      }).catch(error => {
        console.error('Reconnection error:', error);
      });
    }
  }

  private initializeMessageListener() {
    if (!this.client.listenerCount('message')) {
      this.client.on('message', (receivedTopic, message) => {
        this.handleMessage(receivedTopic, message);
      });
    }
  }  

  public checkBridgeState(): Observable<boolean> {
    const topic = `${this.baseTopic}/bridge/state`;
  
    this.getUpdate(topic, "", (message: { state: string }) => {
      this.stateSubject.next(message.state === 'online');
    });
  
    return this.stateSubject.asObservable();
  }

  public checkDeviceState(topic: string, deviceName: string): Observable<Map<string, boolean>> {
    this.getUpdate(topic, "", (message: { state: string }) => {
      const currentStates = this.deviceStateSubject.getValue();
  
      currentStates.set(deviceName, (message.state === 'online'));
  
      this.deviceStateSubject.next(new Map(currentStates));
    });
  
    return this.deviceStateSubject.asObservable();
  }
  
  public setLocalBroker(localBroker:string,baseTopic:string):void{
    this.mqttUrl = localBroker;
    this.baseTopic = baseTopic;
  }  
  public setCloudBroker(username: string):void{
    this.mqttUrl = environment.mqttUrl;
    this.baseTopic = `zigbee2mqtt/${username.split('-')[0]}`;
  }

  public connectToBroker(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('Attempting connection to broker:', this.mqttUrl);

      this.client = mqtt.connect(this.mqttUrl, {
        username: username,
        password: password,
        reconnectPeriod: 0, 
      });
  
      this.client.on('connect', () => {
        console.log('Connected to MQTT broker');

        this.initializeMessageListener();
        this.checkBridgeState();
        resolve(true);
      });
  
      this.client.on('error', (err) => {
        console.error('MQTT Connection Error:', err);
        reject(false);
      });

      this.client.on('close', () => {
        console.log('MQTT connection closed');
        reject(false);
      });
  
      this.client.on('offline', () => {
        console.log('MQTT client is offline');
        reject(false);
      });
    });
  }

  private disconnectFromBroker(): void {
    if (this.client) {
      this.client.end();
      console.log('Disconnected from MQTT broker');
    }
  }
  public isConnected(): boolean {
    return this.client && this.client.connected;
  }

  public subscribeTo(type:string) {
    const topic = `${this.baseTopic}/bridge/${type}`;
    this.subscribe(topic);
    
    return type=='devices' ? this.devicesSubject.asObservable() : this.groupsSubject.asObservable();
  }
  
  public getDevices(): Observable<any[]> {
    return this.subscribeTo('devices').pipe(
      map(devices => {
        return devices.map((device: { friendly_name: string, ieee_address: string, definition?: { exposes: any[] } }) => {
          const exposes = device.definition?.exposes || [];
          const features = exposes?.flatMap(expose => expose.features || []);
          const controls = features.length > 0 
            ? features 
            : exposes.filter(e => !e.category) || [];      
          const type = exposes.length > 0 ? exposes[0].type : null; 
          const otherExposes = features.length > 0 ? exposes.filter(e => !e.category):[];
  
          return {
            friendly_name: device.friendly_name,
            ieee: device.ieee_address,
            controls: controls,
            type: type,
            exposes: [...otherExposes, ...exposes.filter(e => e.category)]
          };
        });
      })
    );
  }
  
  public getGroups(): Observable<any[]> {
    return this.subscribeTo('groups').pipe(
      map(groups => {
        return groups.map(group => {
          return {
            friendly_name: group.friendly_name,
            id: group.id,
            memberAddresses: (group.members || []).map((m: any) => m.ieee_address),
            members: [] as any[],
            scenes: group.scenes || [],
          };
        });
      }),
      switchMap(groups => {
        return this.getDevices().pipe(
          map(devices => {
            groups.forEach(group => {
              group.members = devices.filter(device =>
                group.memberAddresses.includes(device.ieee)
              );
            });
            return groups;
          })
        );
      })
    );
  }
  
  
    
  public getBaseTopic():string {
    return this.baseTopic;
  }

  public subscribe(topic: string): void {
    if (this.client && this.client.connected && !this.topicSubscriptions.has(topic)) {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Subscription error for topic ${topic}`, err);
        } else {
          console.log(`Subscribed to topic: ${topic}`);
          this.topicSubscriptions.add(topic);
          // console.log(this.topicSubscriptions);
        }
      });
    }
  }  

  public clearRetain(topic: string): void {
    this.client.publish(topic, '', { retain: true });
  }

  public unsubscribe(topic: string): void {
    if (this.client && this.client.connected && this.topicSubscriptions.has(topic)) {
      this.client.unsubscribe(topic, (err) => {
        if (err) {
          console.error(`Unsubscription error for topic ${topic}`, err);
        } else {
          console.log(`Unsubscribed to topic: ${topic}`);
          this.topicSubscriptions.delete(topic);
          // console.log(this.topicSubscriptions);
        }
      });
    }
  }  

  public publish(topic: string, message: string): void {
    if (this.client && this.client.connected) {
      this.client.publish(topic, message, {}, (err) => {
        if (err) {
          console.error(`Publish error to topic ${topic}`, err);
        } else {
          console.log(`Message published to ${topic}: ${message}`);
        }
      });
    }
  }

  private handleMessage(receivedTopic: string, message: Buffer): void { 
    try {
      const parsedMessage = JSON.parse(message.toString());
      
      if (!receivedTopic.includes('/availability')) {
        console.log(`Message received on topic ${receivedTopic}:`, parsedMessage);
      }

      if (receivedTopic === `${this.baseTopic}/bridge/devices`) {
        this.devicesSubject.next(parsedMessage);
      }
      if (receivedTopic === `${this.baseTopic}/bridge/groups`) {
        this.groupsSubject.next(parsedMessage);
      }
  
      const topicCallbacks = this.topicCallbackMap[receivedTopic];

      if (topicCallbacks) {
        topicCallbacks.forEach(({ property, callback }) => {
          const data = parsedMessage;
          this.saveStates(data, receivedTopic);
          callback(property==""?data:data[property]);
        });
      }
    } catch (error) {
      console.error(`Failed to parse message from topic ${receivedTopic}:`, error);
    }
  }
  
  public getUpdate(topic: string, property: string, callback: (data: any) => void): void {
    if (topic.includes('/availability')){
      this.subscribe(`${this.baseTopic}/+/availability`)
    } else if (topic.includes(this.baseTopic)&&!topic.includes('/bridge')){
      this.subscribe(`${this.baseTopic}/+`)
    } else {
      this.subscribe(topic);
    }
    
    if (!this.topicCallbackMap[topic]) {
      this.topicCallbackMap[topic] = [];
    }
    
    this.topicCallbackMap[topic].push({ property, callback });
  }

  private saveStates(data:any, name:string){
      localStorage.setItem(name, JSON.stringify(data));
  }
}
