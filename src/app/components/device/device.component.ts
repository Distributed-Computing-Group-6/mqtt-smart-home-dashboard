import { Component, Inject, Input, TemplateRef } from '@angular/core';
import { MqttService } from '../../services/mqtt.service';
import { NgIfContext } from '@angular/common';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrl: './device.component.css'
})
export class DeviceComponent {
  @Input() device!: any;
  topic!: string;
  elseTemplate!: TemplateRef<NgIfContext<boolean>> | null ;
  @Input() isCard: boolean = true;

  constructor(public mqttService: MqttService) {}

  ngOnInit() {
    console.log(this.isCard);
    this.topic = `${this.mqttService.getBaseTopic()}/${this.device.friendly_name}`;
  }
  
}
