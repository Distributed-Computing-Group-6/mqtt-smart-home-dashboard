import { Component, Inject, Input } from '@angular/core';
import { MqttService } from '../../services/mqtt.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrl: './device.component.css'
})
export class DeviceComponent {
  @Input() name: string = "";
  @Input() features: any[] = [];
  @Input() type: string = "";

  topic!: string;

  constructor(public mqttService: MqttService) {}

  ngOnInit() {
    this.topic = `${this.mqttService.getBaseTopic()}/${this.name}`;
  }
}
