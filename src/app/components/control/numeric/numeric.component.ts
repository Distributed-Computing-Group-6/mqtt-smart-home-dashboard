import { Component, HostListener } from '@angular/core';
import { BasicExposeComponent } from '../basic-expose/basic-expose.component';

@Component({
  selector: 'app-numeric',
  templateUrl: './numeric.component.html',
  styleUrl: './numeric.component.css'
})
export class NumericComponent extends BasicExposeComponent {
  minValue!: number;
  maxValue!: number;
  isCompact: boolean = true;
  inputName!: string;
  override inputValue!: number;

  starting() {
    this.minValue = this.control?.value_min ?? 0;    // Default to 0 if undefined
    this.maxValue = this.control?.value_max ?? 254;    // Default to 254 if undefined
    this.inputValue = this.minValue;
    // console.log('NumericComponent initialized with control:', this.control);

    this.checkScreenSize();

    if (this.control) {
      const savedState = JSON.parse(localStorage.getItem(this.topic)!);
      const property = this.control.property;

      if (savedState && savedState[property] !== undefined) {
        this.inputValue = Math.max(this.minValue, Math.min(this.maxValue, Number(savedState[property])));
      } else {
        this.inputValue = this.maxValue; // Default to min if no saved state
      }

      // console.log('Initial inputValue:', this.inputValue);
    } else {
      // console.error('Control object is undefined!');
    }
  }

  override startState(): void {
    this.starting();
    if (this.control) {
      const savedState = JSON.parse(localStorage.getItem(this.topic)!);
      const property = this.control.property;

      if (savedState && savedState[property] !== undefined) {
        this.inputValue = Math.max(this.minValue, Math.min(this.maxValue, Number(savedState[property])));
        this.setValue(this.inputValue);
      } 
    } else {
      // console.error('Control is not defined. Using default values.');
    }
  }

  override stateChange(): void {
    const stateTopic = `${this.topic}/set/${this.control.property}`;
    this.mqttService.publish(stateTopic, this.inputValue.toString());
    this.setValue(this.inputValue);
    // console.log('Published new value to MQTT:', this.inputValue);
  }

  getGradient(value: number): string {
    // Adjust the color temperature based on inputValue (this is an example)
    let color1 = `rgb(173, 216, 230)`;  // Light Daylight
    let color2 = `rgb(255, 255, 255)`;  // Neutral white
    let color3 = `rgb(255, 153, 51)`;   // Candlelight
  
    return `linear-gradient(to right, ${color1}, ${color2}, ${color3})`;
  }  
  
    setValue(value:number):void {
      if(this.canWrite()){
        this.inputValue=value;
        if(this.control.presets){
          this.inputName = this.control.presets.reduce((prev: { value: number; }, curr: { value: number; }) => 
          Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev
        ).name;
          console.log(this.inputName)
        }
      }
    }
  
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
      this.checkScreenSize();
    }
  
    checkScreenSize() {
      if(this.control.presets){
        console.log(this.control.presets.length)
        if(window.innerWidth < 480){
          this.isCompact = this.control.presets.length<=1;
        } else if(window.innerWidth < 768){
          this.isCompact = this.control.presets.length<=3;
        } else {
          this.isCompact = this.control.presets.length<=5;
        }
      }
    }
}
