import { Component, Inject, Input } from '@angular/core';
import { MqttService } from '../../../services/mqtt.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrl: './device.component.css'
})
export class DeviceComponent {
  @Input() name: string = "";
  @Input() features: any[] = [];
  @Input() type: string = "";

  topic: string | undefined;

  constructor(public mqttService: MqttService) {}

  ngOnInit() {
    this.topic = `${this.mqttService.getBaseTopic()}/${this.name}`;
  }

    turnOn(): void {
      const stateTopic:string = `${this.topic}/set/state`;
      this.mqttService.publish(stateTopic,'on');
    }
    turnOff(): void {
      const stateTopic:string = `${this.topic}/set/state`;
      this.mqttService.publish(stateTopic,'off');
    }
    toggle(): void {
      const stateTopic:string = `${this.topic}/set/state`;
      this.mqttService.publish(stateTopic,'toggle');
    }
}
