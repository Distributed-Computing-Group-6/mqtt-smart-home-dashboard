import { Component, OnInit, TemplateRef } from '@angular/core';
import { MqttService } from '../../services/mqtt.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  public devices:any;
  public id!:string|null;

  constructor(private mqttService: MqttService,private route: ActivatedRoute){}

  ngOnInit(): void {
    this.getCards();
  }  

  getCards() {
    this.id = this.route.snapshot.paramMap.get('groupId');

    this.mqttService.getGroups().subscribe((groups: { members: any[], id: number }[]) => {
      if (this.id!=null) {
        const filteredGroup = groups.filter(group => group.id.toString() === this.id);
        if (filteredGroup.length > 0) {
          this.setDevices(filteredGroup[0].members);
        }
      }
    });
    this.mqttService.getDevices().subscribe(devices => {
      if(this.id==null){
        this.setDevices(devices);
      }
    });
  }
  
  public setDevices(devices: any[]) {
    this.devices = devices;
    console.log(this.devices);
  }

  public getDevices(): any {
    this.devices;
  }
}

