import { Component, Inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { MqttService } from '../../services/mqtt.service';
import { NgIfContext } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrl: './device.component.css'
})
export class DeviceComponent {
  @ViewChild('renameModalContent') renameModalContent!: TemplateRef<any>;
  @ViewChild('deleteModalContent') deleteModalContent!: TemplateRef<any>;
  @Input() device!: any;
  @Input() isCard: boolean = true;
  topic!: string;
  baseTopic!: string;
  elseTemplate!: TemplateRef<NgIfContext<boolean>> | null ;
  isInvalid: boolean = false;
  invalidMessage!: string;
  cantRemove: boolean = false;
  deleting: boolean = false;

  constructor(public mqttService: MqttService, private modalService: NgbModal) {}

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
        this.isInvalid = false;
        this.closeModal();
      }
    });
  }

  deleteDevice(){
    const stateTopic:string = `${this.baseTopic}/bridge/request/device/remove`;
    let message = {"id": this.device.friendly_name, "force":this.cantRemove};

    this.deleting=true;

    this.mqttService.publish(stateTopic,JSON.stringify(message));    
    this.mqttService.getUpdate(`${this.baseTopic}/bridge/response/device/remove`, "", (value) => {
      if(value.error){
        console.log(value.error);
        this.cantRemove = true;
        this.invalidMessage = value.error.split(" (")[0] || value.error;
      } else {
        this.cantRemove = false;
        this.closeModal();
      }
      this.deleting=false;
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  openRenameModal() {
    this.modalService.open(this.renameModalContent);
  }  
  openDeleteModal() {
    this.modalService.open(this.deleteModalContent);
  }
}
