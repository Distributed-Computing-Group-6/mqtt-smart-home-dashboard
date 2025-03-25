import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { MqttService } from '../../../services/mqtt.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.css'
})
export class GroupCardComponent {
  @ViewChild('renameModalContent') renameModalContent!: TemplateRef<any>;
  @ViewChild('deleteModalContent') deleteModalContent!: TemplateRef<any>;
  @Input() group!: any;
  topic!: string;
  isEdit: boolean = true;
  baseTopic!: string;
  isInvalid: boolean = false;
  invalidMessage!: string;
  cantRemove: boolean = false;
  
  constructor(public mqttService: MqttService,private modalService: NgbModal) {}

  ngOnInit() {
    this.baseTopic =`${this.mqttService.getBaseTopic()}`;
    this.topic = `${this.baseTopic}/${this.group.friendly_name}`;
  }
  
  editName(event: Event,newName:string){  
    event.preventDefault();

    const stateTopic:string = `${this.baseTopic}/bridge/request/group/rename`;
    let message = {
      from: this.group.friendly_name,
      to: newName.trim()
    };
    console.log(message);
    this.mqttService.publish(stateTopic,JSON.stringify(message));
    
    this.mqttService.getUpdate(`${this.baseTopic}/bridge/response/group/rename`, "", (value) => {
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

  deleteGroup(){
    const stateTopic:string = `${this.baseTopic}/bridge/request/group/remove`;
    let message = {"id": this.group.friendly_name, "force":this.cantRemove};
    console.log(message);
    this.mqttService.publish(stateTopic,JSON.stringify(message));    
    this.mqttService.getUpdate(`${this.baseTopic}/bridge/response/group/remove`, "", (value) => {
      if(value.error){
        console.log(value.error);
        this.cantRemove = true;
        this.invalidMessage = value.error;
      } else {
        this.cantRemove = false;
        this.closeModal();
      }
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
