import { Component, Inject } from '@angular/core';
import { DeviceComponent } from '../device/device.component';
import { MqttService } from '../../../services/mqtt.service';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css'
})
export class SwitchComponent extends DeviceComponent {
  override type: string;

  constructor(mqttService: MqttService) { 
    super(mqttService);
    this.type = "switch";
  }

}
