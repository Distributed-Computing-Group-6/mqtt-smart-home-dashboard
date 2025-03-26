import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MqttService } from '../../services/mqtt.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @ViewChild('addModalContent') addModalContent!: TemplateRef<any>;
  joiningCountdown: number = 0;
  invalidMessage!: string;
  cantFind: boolean = false;
  joinedDevices: { friendly_name: string }[] = [];
  countdown!: number;

  constructor(public mqttService: MqttService,private modalService: NgbModal) {}

  addZigbee(){
    const baseTopic = this.mqttService.getBaseTopic();
    const stateTopic:string = `${baseTopic}/bridge/request/permit_join`;
    let joinTime = 6;
    let message = {"time": joinTime};

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
        this.joinedDevices.push(value.data.friendly_name);
        this.invalidMessage = value.data;
        this.cantFind = false;
      }
    });

  }

  openAddModal() {
    this.modalService.open(this.addModalContent);
  }    

  closeModal() {
    this.modalService.dismissAll();
  }
}