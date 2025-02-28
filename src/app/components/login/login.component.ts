import { Component } from '@angular/core';
import { MqttService } from '../../services/mqtt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private mqttService: MqttService, private router: Router) {}
  
  async onLogin() {
    if (this.username && this.password) {
      try {
        const isConnected = await this.mqttService.connectToBroker(this.username, this.password);
        if (isConnected) {
          console.log('Connected to MQTT broker:', isConnected);
  
          localStorage.setItem('mqttUsername', this.username);
          localStorage.setItem('mqttPassword', this.password);

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
