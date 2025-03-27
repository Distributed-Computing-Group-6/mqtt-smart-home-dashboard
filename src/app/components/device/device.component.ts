import { Component, Inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { MqttService } from '../../services/mqtt.service';
import { NgIfContext } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { ModalComponent } from '../models/modal/modal.component';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrl: './device.component.css'
})
export class DeviceComponent {
  @ViewChild('renameModalContent') renameModalContent!: ModalComponent;
  @ViewChild('deleteModalContent') deleteModalContent!: ModalComponent;
  @Input() device!: any;
  @Input() isCard: boolean = true;
  topic!: string;
  baseTopic!: string;
  elseTemplate!: TemplateRef<NgIfContext<boolean>> | null ;
  invalidMessage: string|undefined;
  isInvalid: boolean = false;
  cantRemove: boolean = false;
  deleting: boolean = false;

  constructor(public mqttService: MqttService, private modalService: NgbModal,private location: Location) {}

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
        this.renameModalContent.closeModal();
      }
    });
  }

  deleteDevice(type:string, name:string){
    const stateTopic:string = `${this.baseTopic}/bridge/request/${type}/remove`;
    let message;

    this.cantRemove=false
    this.deleting=true;

    message = {"id": name, "force":this.cantRemove};

    this.mqttService.publish(stateTopic,JSON.stringify(message));    
    this.mqttService.getUpdate(`${this.baseTopic}/bridge/response/${type}/remove`, "", (value) => {
      if(value.error){
        console.log(value.error);
        this.cantRemove = true;
        this.invalidMessage = value.error.split(" (")[0] || value.error;
      } else {
        this.cantRemove = false;
        this.deleteModalContent.closeModal();
        this.location.back();
      }
      this.deleting=false;
    });
  }

  resetModal(){
    this.isInvalid = false;
    this.cantRemove = false;
    this.deleting = false;
    this.invalidMessage = undefined;
  }

  openRenameModal() {
    this.renameModalContent.openModal();
  }  
  
  openDeleteModal() {
    this.deleteModalContent.openModal();
  }
}
