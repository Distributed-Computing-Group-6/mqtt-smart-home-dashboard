import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MqttService } from '../../../services/mqtt.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @ViewChild('modalContent') modalContent!: TemplateRef<any>;
  @Input() title!: string;
  @Input() bodyTemplate!: TemplateRef<any>;
  @Output() clearModal = new EventEmitter<void>();

  constructor(public mqttService: MqttService, private modalService: NgbModal,private location: Location) {}

  openModal() {    
    this.modalService.open(this.modalContent, { backdrop: 'static', keyboard: false });
  }    

  closeModal() {
    this.clearModal.emit();
    this.modalService.dismissAll();
  }
}
