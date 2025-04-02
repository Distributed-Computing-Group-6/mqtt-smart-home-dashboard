import { Component, HostListener } from '@angular/core';
import { BasicExposeComponent } from '../basic-expose/basic-expose.component';

@Component({
  selector: 'app-enum',
  templateUrl: './enum.component.html',
  styleUrl: './enum.component.css'
})
export class EnumComponent extends BasicExposeComponent {
  isCompact: boolean = true;

  override stateChange(): void {
    let state = this.inputValue;
    const stateTopic:string = `${this.topic}/set/${this.control.property}`;
    this.mqttService.publish(stateTopic,state);
  }
  
  override startState(): void {
    const saveState = JSON.parse(localStorage.getItem(this.topic)!)
    const property = this.control.property;

    console.log(this.control.values.length);

    this.checkScreenSize();

    this.inputValue = saveState && saveState[property] ? saveState[property] : this.control.values[0];
  }

  setValue(value:string):void {
    if(this.canWrite()){
      this.inputValue=value;
      this.stateChange();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if(window.innerWidth < 480){
      this.isCompact = this.control.values.length<=1;
    } else if(window.innerWidth < 768){
      this.isCompact = (this.isCard&&this.control.values.length<=3)||(!this.isCard&&this.control.values.length<=5);
    } else {
      this.isCompact = (this.isCard&&this.control.values.length<=5)||(!this.isCard&&this.control.values.length<=7);
    }
  }

}
