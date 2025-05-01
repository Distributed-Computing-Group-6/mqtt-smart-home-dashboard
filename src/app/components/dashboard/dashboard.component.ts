import { Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { MqttService } from '../../services/mqtt.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;
  public devices:any;
  public id!:string|null;
  public groupName!:string;
  public isBridgeOnline: boolean = false;
  public isVirtualPage: boolean = false;
  private virtualDevices = environment.virtualDevices;
  modalTitle = '';
  modalAction = '';
  modalType = '';
  modalName = '';

  constructor(private mqttService: MqttService,private route: ActivatedRoute){}

  ngOnInit(): void {
    if(this.route.snapshot.url[0].path!="virtual"){
      this.getCards();
      this.checkState();
    } else {
      this.setVirtualPage();
    }
  }
    
  checkState(){
    this.mqttService.checkBridgeState().subscribe(isOnline => {
      this.isBridgeOnline = isOnline;
    });
  }

  setVirtualPage() {
    this.isVirtualPage = true;
    this.devices = this.virtualDevices;
  }

  getCards() {
    this.id = this.route.snapshot.paramMap.get('groupId');

    this.mqttService.getGroups().subscribe((groups: { members: any[], id: number, friendly_name: string }[]) => {
      if (this.id!=null) {
        const filteredGroup = groups.filter(group => group.id.toString() === this.id);
        if (filteredGroup.length > 0) {
          this.setDevices(filteredGroup[0].members);
          this.groupName = filteredGroup[0].friendly_name;
        }
      }
    });
    this.mqttService.getDevices().subscribe(devices => {
      if(this.id==null){
        this.setDevices(devices);
      }
    });
  }
  
  public setDevices(devices: any[]) {
    this.devices = devices;   
    console.log(this.devices);
  }

  public getDevices(): any {
    this.devices;
  }
  openDeleteModal() {
    this.modalTitle = 'Delete ' + this.groupName;
    this.modalAction = 'delete';
    this.modalName = this.groupName;
    this.modalType = 'group';
    this.modalComponent.openModal();
  }
  openRenameModal() {    
    this.modalTitle = 'Rename ' + this.groupName;
    this.modalAction = 'edit';
    this.modalName = this.groupName;
    this.modalType = 'group';
    this.modalComponent.openModal(); 
  }
}

