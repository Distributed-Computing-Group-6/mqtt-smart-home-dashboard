import { Component } from '@angular/core';
import { BasicExposeComponent } from '../../basic-expose/basic-expose.component';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrl: './color.component.css'
})
export class ColorComponent extends BasicExposeComponent{

  override stateChange(): void {
    let state;
    const stateTopic:string = `${this.topic}/set/${this.control.property}`;

    if(this.control.name=="color_xy"){
      state = this.inputValue;
    } else {
      state = null;
    }
    this.mqttService.publish(stateTopic,state);
  }
  
  override startState(): void {
    this.control.label = "Color";
  }

}

