import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MqttService } from '../../services/mqtt.service';
import { EncryptService } from '../../services/encrypt.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnDestroy {

  constructor(private mqttService: MqttService, private router: Router, private encryptService: EncryptService) {
    this.onLogout();
  }

  ngOnDestroy() {
    this.mqttService.logout();
    console.log('Disconnected from broker on logout');
  }

  onLogout() {
    this.encryptService.clearCredentials();
    sessionStorage.removeItem('mqttBroker');
    sessionStorage.removeItem('mqttBasicTopic');
    this.mqttService.logout();
    console.log('Logged out and disconnected from broker');
    this.router.navigate(['/login']);
  }
}
