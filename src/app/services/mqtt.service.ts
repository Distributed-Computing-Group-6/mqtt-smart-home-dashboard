import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import mqtt from 'mqtt';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { EncryptService } from './encrypt.service';


@Injectable({
  providedIn: 'root'
})
export class MqttService {
  private client!: mqtt.MqttClient;
  private mqttUrl = 'wss://t5c7dc17.ala.us-east-1.emqxsl.com:8084/mqtt';
  private baseTopic : string = "";
  private devicesSubject = new BehaviorSubject<any[]>([]);
  private topicSubscriptions: Set<string> = new Set();
  private topicCallbackMap: { [key: string]: { property: string, callback: Function } } = {};

  constructor(private router: Router, private encryptService: EncryptService) {
    this.checkStoredCredentials();
    this.initializeMessageListener();
  }

  private checkStoredCredentials() {
    const credentials = this.encryptService.getCredentials();

    if (credentials) {
      this.connectToBroker(credentials.username, credentials.password).then(isConnected => {
        if (isConnected) {
          console.log('Reconnected to MQTT broker.');
          this.router.navigate(['/']);
<<<<<<< Updated upstream
          console.log('Reconnected to MQTT broker automatically.');
=======
          this.initializeMessageListener();
        } else {
          console.warn('Reconnection failed, prompting for login.');
>>>>>>> Stashed changes
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

  public connectToBroker(username: string, password: string): Promise<boolean> {
    console.log(username);
    return new Promise((resolve, reject) => {
      this.baseTopic = `zigbee2mqtt/${username.split('-')[0]}`

      this.client = mqtt.connect(this.mqttUrl, {
        username: username,
        password: password,
        reconnectPeriod: 0, 
      });
  
      this.client.on('connect', () => {
        console.log('Connected to MQTT broker');
        resolve(true);
      });
  
      this.client.on('error', (err) => {
        console.error('MQTT Connection Error:', err);
        reject(false);
      });
    });
  }

  public disconnectFromBroker(): void {
    if (this.client) {
      this.client.end();
      console.log('Disconnected from MQTT broker');
    }
  }
  public isConnected(): boolean {
    return this.client && this.client.connected;
  }

  public subscribeToDevices() {
    const topic = `${this.baseTopic}/bridge/devices`;
    this.subscribe(topic);
    
    return this.devicesSubject.asObservable();
  }
  
  public getDevices(): Observable<any[]> {
    return this.subscribeToDevices().pipe(
      map(devices => {
        return devices.map((device: { friendly_name: string, definition?: { exposes: any[] } }) => {
          const exposes = device.definition?.exposes || [];
          const features = exposes?.flatMap(expose => expose.features || []);
          const controls = features.length > 0 
            ? features 
            : exposes.filter(e => !e.category) || [];      
          const type = exposes.length > 0 ? exposes[0].type : null; 
  
          return {
            friendly_name: device.friendly_name,
            controls: controls,
            type: type,
            exposes: exposes.filter(e => e.category)
          };
        });
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
      console.log(`Message received on topic ${receivedTopic}:`, parsedMessage);

      if (receivedTopic === `${this.baseTopic}/bridge/devices`) {
        this.devicesSubject.next(parsedMessage);
      }
  
      if (this.topicCallbackMap[receivedTopic]) {
        const { property, callback } = this.topicCallbackMap[receivedTopic];
        const data = parsedMessage;
        this.saveStates(data, receivedTopic);
        callback(data[property]);
      }
  
    } catch (error) {
      console.error(`Failed to parse message from topic ${receivedTopic}:`, error);
    }
  }
  
  public getUpdate(topic: string, property: string, callback: (data: any) => void): void {
    this.subscribe(topic);
  
    this.topicCallbackMap[topic] = { property, callback };
  }

  private saveStates(data:any, name:string){
      localStorage.setItem(name, JSON.stringify(data));
  }
}
