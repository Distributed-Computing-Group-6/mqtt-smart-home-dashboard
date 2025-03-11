import { Component } from '@angular/core';
import { BasicExposeComponent } from '../basic-expose/basic-expose.component';

@Component({
  selector: 'app-numeric',
  templateUrl: './numeric.component.html',
  styleUrl: './numeric.component.css'
})
export class NumericComponent extends BasicExposeComponent {
  minValue!: number;
  maxValue!: number;
  override inputValue!: number;

  override ngOnInit() {
    this.minValue = this.control?.value_min ?? 0;    // Default to 0 if undefined
    this.maxValue = this.control?.value_max ?? 254;    // Default to 254 if undefined
    this.inputValue = this.minValue;
    console.log('NumericComponent initialized with control:', this.control);
    
    if (this.control) {
      const savedState = JSON.parse(localStorage.getItem(this.topic)!);
      const property = this.control.property;

      if (savedState && savedState[property] !== undefined) {
        this.inputValue = Math.max(this.minValue, Math.min(this.maxValue, Number(savedState[property])));
      } else {
        this.inputValue = this.maxValue; // Default to min if no saved state
      }

      console.log('Initial inputValue:', this.inputValue);
    } else {
      console.error('Control object is undefined!');
    }
  }

  override startState(): void {
    if (this.control) {
      const savedState = JSON.parse(localStorage.getItem(this.topic)!);
      const property = this.control.property;
  
      if (savedState && savedState[property] !== undefined) {
        this.inputValue = Math.max(this.minValue, Math.min(this.maxValue, Number(savedState[property])));
      } 
    } else {
      console.error('Control is not defined. Using default values.');
    }
  }

  override stateChange(): void {
    const stateTopic = `${this.topic}/set/${this.control.property}`;
    this.mqttService.publish(stateTopic, this.inputValue.toString());
    console.log('Published new value to MQTT:', this.inputValue);
  }

  getGradient(value: number): string {
    // Adjust the color temperature based on inputValue (this is an example)
    let color1 = `rgb(173, 216, 230)`;  // Light Daylight
    let color2 = `rgb(255, 255, 255)`;  // Neutral white
    let color3 = `rgb(255, 153, 51)`;   // Candlelight
  
    return `linear-gradient(to right, ${color1}, ${color2}, ${color3})`;
  }  
}
