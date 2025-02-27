import { Component } from '@angular/core';
import { DeviceComponent } from '../device/device.component';

@Component({
  selector: 'app-light',
  standalone: true,
  imports: [],
  templateUrl: './light.component.html',
  styleUrl: './light.component.css'
})
export class LightComponent extends DeviceComponent {

}
