import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ModalComponent } from '../models/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MqttService } from '../../services/mqtt.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;
  joiningCountdown: number = 0;
  invalidMessage!: string;
  cantFind: boolean = false;
  joinedDevices: { friendly_name: string; ieee_address: string }[] = [];
  countdown!: number;

  constructor(public mqttService: MqttService) {}

  addZigbee(){
    const baseTopic = this.mqttService.getBaseTopic();
    const stateTopic:string = `${baseTopic}/bridge/request/permit_join`;
    let joinTime = 60;
    let message = {"time": joinTime};

    this.joinedDevices = [];

    this.joiningCountdown=joinTime;

    console.log(message);
    this.mqttService.publish(stateTopic,JSON.stringify(message));    

    const countdownInterval = setInterval(() => {
      if (this.joiningCountdown > 0) {
        this.joiningCountdown--;
      } else {
        clearInterval(countdownInterval);
      }
    }, 1000);
    
    this.mqttService.getUpdate(`${baseTopic}/bridge/event`, "", (value) => {
      if(value.error){
        console.log(value.error);
        this.cantFind = true;
        this.invalidMessage = value.error;
      } else if(value.type == "device_announce"){
        if (!this.joinedDevices.some(device => device.ieee_address === value.data.ieee_address)) {
          this.joinedDevices.push(value.data);
        }
        this.invalidMessage = value.data;
        this.cantFind = false;
      }
    });

  }

  openModal() {
    this.modalComponent.openModal();
  }

  cancelJoin(){
    const baseTopic = this.mqttService.getBaseTopic();
    const stateTopic:string = `${baseTopic}/bridge/request/permit_join`;
    let message = {"time": 0};
    this.mqttService.publish(stateTopic,JSON.stringify(message));   

    this.joinedDevices = [];
    this.invalidMessage = "";
    this.cantFind = false;
    this.joiningCountdown=0;

  }

}