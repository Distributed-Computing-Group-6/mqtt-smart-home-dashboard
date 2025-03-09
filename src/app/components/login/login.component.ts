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

  constructor(private mqttService: MqttService, private router: Router, private encryptService: EncryptService) {}
  
  async onLogin() {
    const _username = this.username;
    const _password = this.password;

    if (_username && _password) {
      try {
        const isConnected = await this.mqttService.connectToBroker(_username, _password);
        if (isConnected) {
          console.log('Connected to MQTT broker:', isConnected);
  
          this.encryptService.saveCredentials(_username,_password);

          this.router.navigate(['/']);
        } else {
          console.error('Failed to connect to MQTT broker');
          alert('Connection failed. Please check your credentials and try again.');
        }
      } catch (error) {
        console.error('Login failed:', error);
        alert('Connection failed. Please check your credentials and try again.');
      }
    } else {
      alert('Please enter both username and password.');
    }
  }
}
