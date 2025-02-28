import { Component, OnInit } from '@angular/core';
import { MqttService } from '../../services/mqtt.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  public devices:any;

  constructor(private mqttService: MqttService){}

  ngOnInit(): void {
    this.mqttService.subscribeToDevices();
    this.mqttService.getDevices().subscribe(devices => {
      this.devices = devices.map((device: { friendly_name: string, definition: any }) => {
        return {
          friendly_name: device.friendly_name,
          definition: device.definition
        };
      });
      console.log(this.devices);
    });
  }
  getDevices(): any {
    this.devices;
  }
}
