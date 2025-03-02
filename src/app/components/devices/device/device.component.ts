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
  states = ['ON', 'OFF', 'Toggle'];

  constructor(public mqttService: MqttService) {}

  ngOnInit() {
    this.topic = `${this.mqttService.getBaseTopic()}/${this.name}`;
  }

    stateChange(state:string): void {
      const stateTopic:string = `${this.topic}/set/state`;
      this.mqttService.publish(stateTopic,state);
    }
}
