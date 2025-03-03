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
      this.devices = devices.map((device: { friendly_name: string, definition?: { exposes: any[]} }) => {
        const exposes = device.definition?.exposes || [];
        const features = exposes.flatMap(expose => expose.features || []);
        const type = exposes.length > 0 ? exposes[0].type : null; 

        return {
          friendly_name: device.friendly_name,
          features: features,
          type: type,
          exposes: exposes.slice(1)
        };
      });
      console.log(this.devices);
    });
  }

  public getDevices(): any {
    this.devices;
  }
}
