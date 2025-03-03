import { Component, Input } from '@angular/core';
import { MqttService } from '../../../services/mqtt.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrl: './state.component.css'
})
export class StateComponent {
  isToggled: boolean = false;
  @Input() topic!: string;
  
  constructor(public mqttService: MqttService) {}

  stateChange(): void {
    let state = this.isToggled ? 'OFF' : 'ON';
    const stateTopic:string = `${this.topic}/set/state`;
    this.mqttService.publish(stateTopic,state);
  }
}
