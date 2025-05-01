import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;
  modalTitle = '';
  modalAction = '';
  modalType = '';
  modalName = '';

  openAddGroupModal() {
    this.modalTitle = 'Add Group';
    this.modalAction = 'add-group';
    this.modalType = 'group';
    this.modalName = '';
    this.modalComponent.openModal();
  }
  
  openAddDeviceModal() {
    this.modalTitle = 'Add Device';
    this.modalAction = 'add-device';
    this.modalType = 'device';
    this.modalName = '';
    this.modalComponent.openModal();
  }
}