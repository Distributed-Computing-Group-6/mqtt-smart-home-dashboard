import { Component, Inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { MqttService } from '../../services/mqtt.service';
import { ModalComponent } from '../modal/modal.component';

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


  openRenameModal() {
    this.renameModalContent.openModal();
  }  
  
  openDeleteModal() {
    this.deleteModalContent.openModal();
  }
}
