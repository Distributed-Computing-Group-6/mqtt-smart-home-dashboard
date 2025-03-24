import { Component } from '@angular/core';
import { BasicExposeComponent } from '../basic-expose/basic-expose.component';

@Component({
  selector: 'app-binary',
  templateUrl: './binary.component.html',
  styleUrl: './binary.component.css'
})
export class BinaryComponent extends BasicExposeComponent{
  value_on!:string;
  value_off!:string;

  override stateChange(state:string = this.inputValue ? this.control.value_on : this.control.value_off): void {
    const stateTopic:string = `${this.topic}/set/${this.control.property}`;
    this.mqttService.publish(stateTopic,state);
  }
  
  override handleChange(value:any): void {
    this.inputValue = value == this.control.value_on;
  }
  
  override startState(): void {
    const saveState = JSON.parse(localStorage.getItem(this.topic)!)
    const property = this.control.property;

    if (property=="contact"){
      this.value_on = this.control.value_on ? "Open" : "Close";
      this.value_off = this.control.value_off ? "Open" : "Close";
    } else {
      this.value_on = this.control.value_on
      this.value_off = this.control.value_off
    }

    this.inputValue = saveState && saveState[property] === this.control.value_on ? true : false;
  }
}
