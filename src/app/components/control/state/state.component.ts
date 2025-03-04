import { Component, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrl: './state.component.css'
})
export class StateComponent extends BaseComponent{
  isToggled: boolean = false;

  stateChange(): void {
    let state = this.isToggled ? this.feature.value_on : this.feature.value_off;
    const stateTopic:string = `${this.topic}/set/${this.feature.name}`;
    this.mqttService.publish(stateTopic,state);
  }
  
  override handleChange(value:any) {
    this.isToggled = value == this.feature.value_on;
  }
  
  override startState() {
    const saveState = JSON.parse(localStorage.getItem(this.topic)!)
    const property = this.feature.property;

    this.isToggled = saveState && saveState[property] === this.feature.value_on ? true : false;
  }
}
