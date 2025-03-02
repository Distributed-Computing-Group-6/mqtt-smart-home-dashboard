import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import mqtt from 'mqtt';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MqttService {
  private client!: mqtt.MqttClient;
  private mqttUrl = 'wss://t5c7dc17.ala.us-east-1.emqxsl.com:8084/mqtt';
  private baseTopic : string = "";
  private devicesSubject = new BehaviorSubject<any[]>([]);
  private devices: any[] = [];

  constructor(private router: Router) {
    this.checkStoredCredentials();
  }

  private checkStoredCredentials() {
    const savedUsername = localStorage.getItem('mqttUsername');
    const savedPassword = localStorage.getItem('mqttPassword');

    if (savedUsername && savedPassword) {
      this.connectToBroker(savedUsername, savedPassword).then(isConnected => {
        console.log(this.isConnected());
        if (isConnected) {
          this.router.navigate(['/']);
          console.log('Reconnected to MQTT broker automatically.');
        }
      }).catch(error => {
        console.error('Failed to reconnect automatically:', error);
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

  public subscribeToDevices(): void {
    const topic = `${this.baseTopic}/bridge/devices`;
  
    this.subscribe(topic);

    this.handleMessages((receivedTopic, parsedMessage) => {
      if (receivedTopic === topic) {
        this.devices = parsedMessage;
        this.devicesSubject.next(this.devices);
      }
    });
  }
  
  public getDevices() {
    return this.devicesSubject.asObservable();
  }
    
  public getBaseTopic():string {
    return this.baseTopic;
  }

  public subscribe(topic: string): void {
    if (this.client && this.client.connected) {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Subscription error for topic ${topic}`, err);
        } else {
          console.log(`Subscribed to topic: ${topic}`);
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

  private handleMessages(callback: (topic: string, parsedMessage: any) => void): void {
    this.client.on('message', (receivedTopic: string, message: Buffer) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        console.log(`Message received on topic ${receivedTopic}:`, parsedMessage);
  
        callback(receivedTopic, parsedMessage);
      } catch (error) {
        console.error(`Failed to parse message from topic ${receivedTopic}:`, error);
      }
    });
  }
  
}
