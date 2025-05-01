import { Component, Inject, Input, Output, OnInit, TemplateRef, ViewChild, EventEmitter} from '@angular/core';
import { MqttService } from '../../services/mqtt.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrl: './device.component.css'
})
export class DeviceComponent implements OnInit {
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;
  @Input() device!: any;
  @Input() isCard: boolean = true;
  @Input() isBridgeOnline: boolean = false;
  isDeviceOnline: boolean = true;
  invalidMessage!: string;
  modalTitle = '';
  modalAction = '';
  modalType = '';
  modalName = '';

  constructor(public mqttService: MqttService) {}

  ngOnInit() {
    this.checkState();
  }

  checkState(){
    const availability = `${this.mqttService.getBaseTopic()}/${this.device.friendly_name}/availability`;
    this.mqttService.checkDeviceState(availability,this.device.friendly_name).subscribe(deviceStates => {
        this.isDeviceOnline = !!deviceStates.get(this.device.friendly_name)||this.isBridgeOnline;
    });
  }

  openRenameModal() {
    this.modalTitle = 'Rename Device';
    this.modalAction = 'edit';
    this.modalName = this.device.friendly_name;
    this.modalType = 'device';
    this.modalComponent.openModal(); 
  }

  openDeleteModal() {
    this.modalTitle = 'Delete Device';
    this.modalAction = 'delete';
    this.modalName = this.device.friendly_name;
    this.modalType = 'device';
    this.modalComponent.openModal();
  }
}
