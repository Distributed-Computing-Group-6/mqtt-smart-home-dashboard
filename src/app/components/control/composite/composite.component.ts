import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-composite',
  templateUrl: './composite.component.html',
  styleUrl: './composite.component.css'
})
export class CompositeComponent{
    @Input() topic!: string;
    @Input() control!: any;
    isCollapsed:boolean = true;

}
