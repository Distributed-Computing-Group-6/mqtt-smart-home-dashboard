import { Component } from '@angular/core';
import { MqttService } from '../../../services/mqtt.service';

@Component({
  selector: 'app-groups-page',
  templateUrl: './groups-page.component.html',
  styleUrl: './groups-page.component.css'
})
export class GroupsPageComponent {  
  public groups:any;
  public devices: any;

  constructor(private mqttService: MqttService){}

  ngOnInit(): void {
    this.getCards();
  }  

  getCards() {
    this.mqttService.getGroups().subscribe(groups => {
      this.groups = groups;
    });
  }
}
