import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MqttService } from '../../services/mqtt.service';

@Component({
  selector: 'app-device-page',
  templateUrl: './device-page.component.html',
  styleUrl: './device-page.component.css'
})
export class DevicePageComponent implements OnInit {
  public device!: any;
  public topic!: string;

  constructor(private mqttService: MqttService,private route: ActivatedRoute,private location: Location) {}

  ngOnInit(): void {
    this.getDevice();
    console.log(this.device);
    this.topic = `${this.mqttService.getBaseTopic()}/${this.device.friendly_name}`
  }  

  getDevice() {
    const id = this.route.snapshot.paramMap.get('deviceId');

    this.mqttService.getDevices().subscribe(devices => {
      this.device = devices.filter(devices => devices.ieee === id)[0];
    });
  }

  goBack() {
    this.location.back();
  }
}
