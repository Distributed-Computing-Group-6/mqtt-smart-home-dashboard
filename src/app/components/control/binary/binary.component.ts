import { Component } from '@angular/core';
import { BasicExposeComponent } from '../basic-expose/basic-expose.component';

@Component({
  selector: 'app-binary',
  templateUrl: './binary.component.html',
  styleUrl: './binary.component.css'
})
export class BinaryComponent extends BasicExposeComponent{

  override stateChange(): void {
    let state = this.inputValue ? this.control.value_on : this.control.value_off;
    const stateTopic:string = `${this.topic}/set/${this.control.property}`;
    this.mqttService.publish(stateTopic,state);
  }
  
  override handleChange(value:any): void {
    this.inputValue = value == this.control.value_on;
  }
  
  override startState(): void {
    const saveState = JSON.parse(localStorage.getItem(this.topic)!)
    const property = this.control.property;

    this.inputValue = saveState && saveState[property] === this.control.value_on ? true : false;
  }
}
