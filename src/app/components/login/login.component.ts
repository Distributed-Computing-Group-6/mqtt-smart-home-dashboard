import { Component } from '@angular/core';
import { MqttService } from '../../services/mqtt.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private mqttService: MqttService) {}

  onLogin() {
    console.log(this.username);
    if (this.username && this.password) {
      this.mqttService.connectToBroker(this.username, this.password);
    }
  }
}
