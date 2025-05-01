import { Component } from '@angular/core';
import { BasicExposeComponent } from '../basic-expose/basic-expose.component';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrl: './text.component.css'
})
export class TextComponent extends BasicExposeComponent {
  override stateChange(): void {
    const stateTopic: string = `${this.topic}/set/${this.control.property}`;
    this.mqttService.publish(stateTopic, this.inputValue);
  }

  override startState(): void {
    const savedState = JSON.parse(localStorage.getItem(this.topic) || '{}');
    const property = this.control.property;

    this.inputValue = savedState && savedState[property] ? savedState[property] : '';
  }

  onInputChange(value: string): void {
    if (this.canWrite()) {
      this.inputValue = value;
      this.stateChange();
    }
  }
}
