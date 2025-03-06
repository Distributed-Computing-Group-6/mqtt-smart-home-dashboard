import { Component } from '@angular/core';
import { BasicExposeComponent } from '../basic-expose/basic-expose.component';

@Component({
  selector: 'app-composite',
  templateUrl: './composite.component.html',
  styleUrl: './composite.component.css'
})
export class CompositeComponent extends BasicExposeComponent {
    isCollapsed:boolean = true;
}
