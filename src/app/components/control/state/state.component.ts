import { Component, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrl: './state.component.css'
})
export class StateComponent extends BaseComponent{

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
