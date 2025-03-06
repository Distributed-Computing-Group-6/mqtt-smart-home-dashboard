import { Component } from '@angular/core';
import { BasicExposeComponent } from '../basic-expose/basic-expose.component';

@Component({
  selector: 'app-enum',
  templateUrl: './enum.component.html',
  styleUrl: './enum.component.css'
})
export class EnumComponent extends BasicExposeComponent {

  override stateChange(): void {
    let state = this.inputValue;
    const stateTopic:string = `${this.topic}/set/${this.control.property}`;
    this.mqttService.publish(stateTopic,state);
  }
  
  override startState(): void {
    const saveState = JSON.parse(localStorage.getItem(this.topic)!)
    const property = this.control.property;

    this.inputValue = saveState && saveState[property] ? saveState[property] : this.control.values[0];
  }

  setValue(value:string):void {
    if(this.canWrite()){
      this.inputValue=value;
      this.stateChange();
    }
  }

}
