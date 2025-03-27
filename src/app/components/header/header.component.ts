import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

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