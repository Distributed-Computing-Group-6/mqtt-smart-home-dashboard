import { Component, Inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { MqttService } from '../../services/mqtt.service';
import { NgIfContext } from '@angular/common';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrl: './device.component.css'
})
export class DeviceComponent { 
  @ViewChild('editModalClose') editClose: any;
  @Input() device!: any;
  @Input() isCard: boolean = true;
  topic!: string;
  baseTopic!: string;
  elseTemplate!: TemplateRef<NgIfContext<boolean>> | null ;
  isInvalid: boolean = false;
  invalidMessage!: string;

  constructor(public mqttService: MqttService) {}

  ngOnInit() {
    this.baseTopic =`${this.mqttService.getBaseTopic()}`;
    this.topic = `${this.baseTopic}/${this.device.friendly_name}`;
  }

  editName(event: Event,newName:string){  
    event.preventDefault();

    const stateTopic:string = `${this.baseTopic}/bridge/request/device/rename`;
    let message = {
      from: this.device.friendly_name,
      to: newName.trim()
    };
    console.log(message);
    this.mqttService.publish(stateTopic,JSON.stringify(message));
    
    this.mqttService.getUpdate(`${this.baseTopic}/bridge/response/device/rename`, "", (value) => {
      if(value.error){
        console.log(value.error);
        this.isInvalid = true;
        this.invalidMessage = value.error;
      } else {
        this.editClose.nativeElement.click();
        this.isInvalid = false;
      }
    });
  }

  deleteDevice(){
    const stateTopic:string = `${this.baseTopic}/bridge/request/device/remove`;
    let message = this.device.friendly_name;
    console.log(message);
    this.mqttService.publish(stateTopic,message);
  }
}
