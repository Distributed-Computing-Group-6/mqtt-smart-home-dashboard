import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MqttService } from '../../services/mqtt.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnDestroy {

  constructor(private mqttService: MqttService, private router: Router) {
    this.onLogout();
  }

  ngOnDestroy() {
    this.mqttService.disconnectFromBroker();
    console.log('Disconnected from broker on logout');
  }

  onLogout() {
    localStorage.removeItem('mqttUsername');
    localStorage.removeItem('mqttPassword')
    this.mqttService.disconnectFromBroker();
    console.log('Logged out and disconnected from broker');
    this.router.navigate(['/login']);
  }
}
