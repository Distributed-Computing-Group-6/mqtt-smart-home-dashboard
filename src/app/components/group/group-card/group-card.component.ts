import { Component, Input } from '@angular/core';
import { MqttService } from '../../../services/mqtt.service';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.css'
})
export class GroupCardComponent {
  @Input() group!: any;
  topic!: string;
  
  constructor(public mqttService: MqttService) {}

  ngOnInit() {
    this.topic = `${this.mqttService.getBaseTopic()}/${this.group.friendly_name}`;
  }
  
}
