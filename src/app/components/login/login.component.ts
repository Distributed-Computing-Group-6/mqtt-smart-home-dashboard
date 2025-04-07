import { Component } from '@angular/core';
import { MqttService } from '../../services/mqtt.service';
import { Router } from '@angular/router';
import { EncryptService } from '../../services/encrypt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  isLocal: boolean = false;
  localBroker!: string;
  basetopic!: string;
  wsProtocol: string = 'ws://';
  invalidMessage!: string;
  port!: number;
  wholeBroker!: string;

  constructor(private mqttService: MqttService, private router: Router, private encryptService: EncryptService) {}
  
  async onLogin() {
    const _username = this.username;
    const _password = this.password;
  
    sessionStorage.removeItem('mqttBroker');
    sessionStorage.removeItem('mqttBasicTopic');
  
    this.invalidMessage = 'Connecting...';
  
    try {
      const isConnected = await this.mqttService.connectToBroker(_username, _password);
  
      if (isConnected) {
  
        this.encryptService.saveCredentials(_username, _password);
  
        this.router.navigate(['/']);
        return true;
      } else {
        console.error('Failed to connect to MQTT broker');
        this.invalidMessage = 'Connection failed. Please check your credentials and try again.';
      }
    } catch (error) {
      console.error('Login failed:', error);
      this.invalidMessage = 'Connection failed. Please check your credentials and try again.';
      return false;
    }
  
    return false;
  }
  

  onCloud() {
    this.mqttService.setCloudBroker(this.username);
    this.onLogin();
  }

  async onLocal() {
    this.wholeBroker = `${this.wsProtocol}${this.localBroker}:${this.port}`;
    const _basetopic = this.basetopic;
  
    if (this.wholeBroker && _basetopic) {
      this.mqttService.setLocalBroker(this.wholeBroker, _basetopic);
      let isConnected = await this.onLogin();
  
      if (!isConnected) {
        this.wholeBroker = `${this.wholeBroker}/mqtt`;
        this.mqttService.setLocalBroker(this.wholeBroker, _basetopic);
        isConnected = await this.onLogin();
      }
  
      if (isConnected) {
        sessionStorage.setItem('mqttBroker', this.wholeBroker);
        sessionStorage.setItem('mqttBasicTopic', _basetopic);
      }
    }
  }
}
