import { Component } from '@angular/core';
import { BasicExposeComponent } from '../basic-expose/basic-expose.component';

@Component({
  selector: 'app-binary',
  templateUrl: './binary.component.html',
  styleUrl: './binary.component.css'
})
export class BinaryComponent extends BasicExposeComponent{

  override stateChange(): void {
    let state = this.inputValue ? this.feature.value_on : this.feature.value_off;
    const stateTopic:string = `${this.topic}/set/${this.feature.property}`;
    this.mqttService.publish(stateTopic,state);
  }
  
  override handleChange(value:any): void {
    this.inputValue = value == this.feature.value_on;
  }
  
  override startState(): void {
    const saveState = JSON.parse(localStorage.getItem(this.topic)!)
    const property = this.feature.property;

    this.inputValue = saveState && saveState[property] === this.feature.value_on ? true : false;
  }
}
