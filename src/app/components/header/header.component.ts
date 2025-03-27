import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ModalComponent } from '../models/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MqttService } from '../../services/mqtt.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  openModal() {
    this.modalComponent.openModal();
  }

}