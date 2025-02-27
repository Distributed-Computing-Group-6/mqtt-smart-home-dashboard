import { Injectable } from '@angular/core';
import mqtt from 'mqtt';


@Injectable({
  providedIn: 'root'
})
export class MqttService {
  private client!: mqtt.MqttClient;
  private mqttUrl = 'wss://t5c7dc17.ala.us-east-1.emqxsl.com:8084/mqtt'; // Replace with your broker URL
  private options = {
    username: 'test',
    password: 'test',
  };

  constructor() {
    // this.connectToBroker();
  }

  public connectToBroker(username: string, password: string) { 
    this.options = {
    username: username,
    password: password,
  };
    this.client = mqtt.connect(this.mqttUrl, this.options);

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
    });

    this.client.on('error', (err) => {
      console.error('MQTT Connection Error:', err);
    });
  }

  public subscribe(topic: string) {
    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error(`Subscription error for topic ${topic}`, err);
      } else {
        console.log(`Subscribed to topic: ${topic}`);
      }
    });
  }

  public publish(topic: string, message: string) {
    this.client.publish(topic, message, {}, (err) => {
      if (err) {
        console.error(`Publish error to topic ${topic}`, err);
      } else {
        console.log(`Message published to ${topic}: ${message}`);
      }
    });
  }

  public onMessage(callback: (topic: string, message: string) => void) {
    this.client.on('message', (topic, message) => {
      callback(topic, message.toString());
    });
  }
}
