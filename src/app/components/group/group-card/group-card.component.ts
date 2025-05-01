import { Component, Input, ViewChild } from '@angular/core';
import { MqttService } from '../../../services/mqtt.service';
import { ModalComponent } from '../../modal/modal.component';

declare var $: any;

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.css'
})
export class GroupCardComponent {
  @ViewChild('renameModalContent') renameModalContent!: ModalComponent;
  @ViewChild('deleteModalContent') deleteModalContent!: ModalComponent;  
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;
  @Input() group!: any;
  @Input() isBridgeOnline: boolean = false;
  topic!: string;
  isEdit: boolean = true;

  constructor(public mqttService: MqttService) {}

  ngOnInit() {
    this.topic =`${this.mqttService.getBaseTopic()}/${this.group.friendly_name}`;
  }

  openRenameModal() {
    this.renameModalContent.openModal();
  }  
  
  openDeleteModal() {
    this.deleteModalContent.openModal();
  }  
}
