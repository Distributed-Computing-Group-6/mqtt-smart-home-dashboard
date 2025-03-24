import { Component, Input } from '@angular/core';
import { BasicExposeComponent } from '../basic-expose/basic-expose.component';

@Component({
  selector: 'app-composite',
  templateUrl: './composite.component.html',
  styleUrl: './composite.component.css'
})
export class CompositeComponent extends BasicExposeComponent {
    isCollapsed:boolean = true;
    @Input() type="component"

    override startState(): void {
      if(this.control.controls){
        this.control.features = this.control.controls;
        this.control.label = this.control.friendly_name;
      }
    }
}
