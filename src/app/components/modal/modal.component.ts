import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MqttService } from '../../services/mqtt.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @ViewChild('modalContent') modalContent!: TemplateRef<any>;
  @Input() title!: string;
  @Input() bodyTemplate!: TemplateRef<any>;
  @Input() name!: string;
  @Input() type!: string;
  @Input() action!: string;
  @Input() devices!: any;
  @Input() members!: any;
  @Output() onMemberChange = new EventEmitter<void>();
  
  baseTopic!: string;
  invalidMessage!: string;
  isInvalid: boolean = false;
  cantRemove: boolean = false;
  deleting: boolean = false;
  cantFind: boolean = false;
  isBridgeOnline: boolean = false;
  joiningCountdown: number = 0;
  joinedDevices: { friendly_name: string; ieee_address: string }[] = [];
  countdown!: number;
  oldName!: string;
  deviceNameInput:string = "";



  constructor(public mqttService: MqttService, private modalService: NgbModal,private location: Location, private router: Router) {}

  ngOnInit() {
    this.baseTopic =`${this.mqttService.getBaseTopic()}`;
    this.checkState();
  }

  checkState(){
    this.mqttService.checkBridgeState().subscribe(isOnline => {
      this.isBridgeOnline = isOnline;
      this.cantFind=!isOnline;
      this.isInvalid=!isOnline;
      this.cantRemove=!isOnline;
      this.invalidMessage = isOnline ? "" : "The bridge is offline. Please check your connection.";
    });
  }

  addGroup(groupName: string, groupId?: number) {
    const baseTopic = this.mqttService.getBaseTopic();
    const stateTopic: string = `${baseTopic}/bridge/request/group/add`;
    const responseTopic: string = `${baseTopic}/bridge/response/group/add`;
  
    let payload: string | object;
    if (groupId !== undefined && !isNaN(groupId)) {
      payload = {
        friendly_name: groupName.trim(),
        id: groupId
      };
    } else {
      payload = groupName.trim(); 
    }
  
    console.log('Sending add group request:', payload);
    this.mqttService.publish(stateTopic, JSON.stringify(payload));
  
    this.mqttService.getUpdate(responseTopic, "", (value) => {
      if (value.error) {
        console.log(value.error);
        this.isInvalid = true;
        this.invalidMessage = value.error;
      } else {
        console.log('Group added successfully:', value);
        this.isInvalid = false;
        this.closeModal();
      }
    });
  }  

  addDeviceToGroup(deviceName: string, groupName: string) {
    const baseTopic = this.mqttService.getBaseTopic();
    const stateTopic:string = `${baseTopic}/bridge/request/group/members/add`;
    const responseTopic: string = `${baseTopic}/bridge/response/group/members/add`;
    const payload = {
      group: groupName,
      device: deviceName
    };
  
    console.log(`Adding ${deviceName} to group ${groupName}`);
    this.mqttService.publish(stateTopic, JSON.stringify(payload));

    this.mqttService.getUpdate(responseTopic, "", (value) => {
      if (value.error) {
        console.log(value.error);
        this.isInvalid = true;
        this.invalidMessage = value.error;
      } else {
        console.log(`${deviceName} added to ${groupName} successfully:`, value);
        this.isInvalid = false;
        this.onDataChange();
        this.closeModal();
      }
    });
  }
  
  removeDeviceFromGroup(deviceName: string, groupName: string) {
    const baseTopic = this.mqttService.getBaseTopic();
    const stateTopic:string = `${baseTopic}/bridge/request/group/members/remove`;    
    const responseTopic: string = `${baseTopic}/bridge/response/group/members/remove`;
    const payload = {
      group: groupName,
      device: deviceName
    };
    
    console.log(`Removing ${deviceName} from group ${groupName}`);
    this.mqttService.publish(stateTopic, JSON.stringify(payload));    

    this.mqttService.getUpdate(responseTopic, "", (value) => {
      if (value.error) {
        console.log(value.error);
        this.isInvalid = true;
        this.invalidMessage = value.error;
      } else {
        console.log(`${deviceName} removed from ${groupName} successfully:`, value);
        this.isInvalid = false;
        this.onDataChange();
        this.closeModal();
      }
    });
  }
  
  removeDeviceFromAllGroups(deviceName: string) {
    const baseTopic = this.mqttService.getBaseTopic();
    const stateTopic:string = `${baseTopic}/bridge/request/group/members/remove_all`;    
    const responseTopic: string = `${baseTopic}/bridge/response/group/members/remove_all`;
    const payload = {
      device: deviceName
    };
    
    console.log(`Removing ${deviceName} from all groups`);
    this.mqttService.publish(stateTopic, JSON.stringify(payload));

    this.mqttService.getUpdate(responseTopic, "", (value) => {
      if (value.error) {
        console.log(value.error);
        this.isInvalid = true;
        this.invalidMessage = value.error;
      } else {
        console.log(`${deviceName} removed from all groups successfully:`, value);
        this.isInvalid = false;
        this.closeModal();
      }
    });    
  }   

  addZigbee(){
    const baseTopic = this.mqttService.getBaseTopic();
    const stateTopic:string = `${baseTopic}/bridge/request/permit_join`;
    let joinTime = 60;
    let message = {"time": joinTime};

    this.joinedDevices = [];

    if(this.joiningCountdown > 0){
      this.cancelJoin();
      return;
    } else {
      this.joiningCountdown=joinTime;
    }

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
    const responseTopic:string = `${this.baseTopic}/bridge/response/${this.type}/rename`;
    let oldName = this.name;

    let message = {
      from: this.name,
      to: newName.trim()
    };
    console.log(message);
    this.mqttService.publish(stateTopic,JSON.stringify(message));
    
    this.mqttService.getUpdate(responseTopic, "", (value) => {
      if(value.error){
        console.log(value.error);
        this.isInvalid = true;
        this.invalidMessage = value.error;
      } else {
        this.isInvalid = false;
        this.closeModal();
        this.unsubscribe(oldName);
      }
    });
  }
  
  deleteItem(){
    const stateTopic:string = `${this.baseTopic}/bridge/request/${this.type}/remove`;
    const responseTopic:string = `${this.baseTopic}/bridge/response/${this.type}/remove`;
    let oldName = this.name;
    let message;

    this.oldName=this.name;
  
    this.deleting=true;
  
    message = {"id": this.name, "force":this.cantRemove};
  
    console.log(message);
    this.mqttService.publish(stateTopic,JSON.stringify(message));    
    this.mqttService.getUpdate(responseTopic, "", (value) => {
      if(value.error){
        console.log(value.error);
        this.cantRemove = true;
        this.invalidMessage = value.error.split(" (")[0] || value.error;
      } else {
        this.cantRemove = false;
        this.closeModal();
        this.unsubscribe(oldName);
        if(this.type=="device"){
          this.location.back();
        } else {
          this.router.navigate(['/groups']);
        }
      }
      this.deleting=false;
    });
  }

  unsubscribe(oldName:string){
    this.mqttService.clearRetain(`${this.baseTopic}/${oldName}/availability`)
  }

  resetModal(){
    this.isInvalid = false;
    this.cantRemove = false;
    this.deleting=false;
    this.invalidMessage = "";
    this.deviceNameInput = ""
    if(this.joiningCountdown>0){
      this.cancelJoin();
    }
    this.checkState();
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

  async closeModal() {
    this.resetModal();    
    await Promise.all([
      this.mqttService.unsubscribe(`${this.baseTopic}/bridge/event`),
      this.mqttService.unsubscribe(`${this.baseTopic}/bridge/response/${this.type}/rename`),
      this.mqttService.unsubscribe(`${this.baseTopic}/bridge/response/${this.type}/remove`)
    ]);
    this.modalService.dismissAll();
  } 

  onDataChange() {
    this.onMemberChange.emit();
  }
}