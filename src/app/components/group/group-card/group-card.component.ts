import { Component, Input, ViewChild } from '@angular/core';
import { MqttService } from '../../../services/mqtt.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.css'
})
export class GroupCardComponent {
  @ViewChild('editModalClose') editClose: any;
  @Input() group!: any;
  topic!: string;
  isEdit: boolean = true;
  baseTopic!: string;
  isInvalid: boolean = false;
  invalidMessage!: string;
  
  constructor(public mqttService: MqttService, private modalService: NgbModal) {}

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
        this.editClose.nativeElement.click();
        this.isInvalid = false;
      }
    });
  }

  deleteGroup(){
    const stateTopic:string = `${this.baseTopic}/bridge/request/group/remove`;
    let message = this.group.friendly_name;
    console.log(message);
    this.mqttService.publish(stateTopic,message);
  }

  closeModal() {
    // You need to get the modal reference and close it
    this.modalService.dismissAll();  // This closes all open modals
  }
  
}
