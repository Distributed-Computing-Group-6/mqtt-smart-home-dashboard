import { Component, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MqttService } from '../../services/mqtt.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrl: './device.component.css'
})
export class DeviceComponent implements OnInit {
  @ViewChild('renameModalContent') renameModalContent!: ModalComponent;
  @ViewChild('deleteModalContent') deleteModalContent!: ModalComponent;
  @Input() device!: any;
  @Input() isCard: boolean = true;
  @Input() isBridgeOnline: boolean = false;
  isDeviceOnline: boolean = true;
  invalidMessage!: string;

  constructor(public mqttService: MqttService) {}

  ngOnInit() {
    this.checkState();
  }

  checkState(){
    const availability = `${this.mqttService.getBaseTopic()}/${this.device.friendly_name}/availability`;
    this.mqttService.checkDeviceState(availability,this.device.friendly_name).subscribe(deviceStates => {
      this.isDeviceOnline = !!deviceStates.get(this.device.friendly_name);
    });
  }

  openRenameModal() {
    this.renameModalContent.openModal();
  }  
  
  openDeleteModal() {
    this.deleteModalContent.openModal();
  }
}
