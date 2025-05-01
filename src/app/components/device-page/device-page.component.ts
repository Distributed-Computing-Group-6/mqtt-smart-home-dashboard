import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MqttService } from '../../services/mqtt.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-device-page',
  templateUrl: './device-page.component.html',
  styleUrl: './device-page.component.css'
})
export class DevicePageComponent implements OnInit {
  public device!: any;
  public topic!: string;  
  public isBridgeOnline: boolean = false;
  private virtualDevices = environment.virtualDevices;

  constructor(private mqttService: MqttService,private route: ActivatedRoute,private location: Location) {}

  ngOnInit(): void {
    this.getDevice();
    console.log(this.device);
    this.topic = `${this.mqttService.getBaseTopic()}/${this.device.friendly_name}`
  }  
  
  checkState(){
    this.mqttService.checkBridgeState().subscribe(isOnline => {
      this.isBridgeOnline = isOnline;
    });
  }

  getDevice() {
    const id = this.route.snapshot.paramMap.get('deviceId');

    if(id!.startsWith('0v')){
      this.device = this.virtualDevices.filter(devices => devices.ieee === id)[0];
      this.isBridgeOnline = true;
    } else {
      this.checkState();
      this.mqttService.getDevices().subscribe(devices => {
        this.device = devices.filter(devices => devices.ieee === id)[0];
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
