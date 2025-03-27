import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MqttService } from '../../services/mqtt.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @ViewChild('modalContent') modalContent!: TemplateRef<any>;
  @Input() title!: string;
  @Input() bodyTemplate!: TemplateRef<any>;
  @Input() name!: any;
  @Input() type!: any;
  @Input() action!: string;
  baseTopic!: string;
  invalidMessage!: string;
  isInvalid: boolean = false;
  cantRemove: boolean = false;
  deleting: boolean = false;
  joiningCountdown: number = 0;
  cantFind: boolean = false;
  joinedDevices: { friendly_name: string; ieee_address: string }[] = [];
  countdown!: number;

  constructor(public mqttService: MqttService, private modalService: NgbModal,private location: Location) {}

  ngOnInit() {
    this.baseTopic =`${this.mqttService.getBaseTopic()}`;
  }

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
  
  editName(event: Event,newName:string){  
    event.preventDefault();
  
    const stateTopic:string = `${this.baseTopic}/bridge/request/${this.type}/rename`;
    let message = {
      from: this.name,
      to: newName.trim()
    };
    console.log(message);
    this.mqttService.publish(stateTopic,JSON.stringify(message));
    
    this.mqttService.getUpdate(`${this.baseTopic}/bridge/response/${this.type}/rename`, "", (value) => {
      if(value.error){
        console.log(value.error);
        this.isInvalid = true;
        this.invalidMessage = value.error;
      } else {
        this.isInvalid = false;
        this.closeModal();
      }
    });
  }
  
  deleteItem(){
    const stateTopic:string = `${this.baseTopic}/bridge/request/${this.type}/remove`;
    let message;
  
    this.deleting=true;
  
    message = {"id": this.name, "force":this.cantRemove};
  
    console.log(message);
    this.mqttService.publish(stateTopic,JSON.stringify(message));    
    this.mqttService.getUpdate(`${this.baseTopic}/bridge/response/${this.type}/remove`, "", (value) => {
      if(value.error){
        console.log(value.error);
        this.cantRemove = true;
        this.invalidMessage = value.error.split(" (")[0] || value.error;
      } else {
        this.cantRemove = false;
        this.closeModal();
        if(this.type=="device"){
          this.location.back();
        }
      }
      this.deleting=false;
    });
  }
  
  resetModal(){
    this.isInvalid = false;
    this.cantRemove = false;
    this.deleting=false;
    this.invalidMessage = "";
    if(this.joiningCountdown>0){
      this.cancelJoin();
    }
  }

  cancelJoin(){
    const baseTopic = this.mqttService.getBaseTopic();
    const stateTopic:string = `${baseTopic}/bridge/request/permit_join`;
    let message = {"time": 0};
    this.mqttService.publish(stateTopic,JSON.stringify(message));   

    this.joinedDevices = [];
    this.cantFind = false;
    this.joiningCountdown=0;
  }
  
  openModal() {    
    this.modalService.open(this.modalContent, { backdrop: 'static', keyboard: false });
  }    

  closeModal() {
    this.resetModal();
    this.modalService.dismissAll();
  }
}



