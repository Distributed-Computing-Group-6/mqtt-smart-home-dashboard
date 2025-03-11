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
  @Input() id!: number;
  topic!: string;
  elseTemplate!: TemplateRef<NgIfContext<boolean>> | null ;

  constructor(public mqttService: MqttService) {}

  ngOnInit() {
    this.topic = `${this.mqttService.getBaseTopic()}/${this.device.friendly_name}`;
  }
  
}
