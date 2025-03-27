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
  public groupName!:string;

  constructor(private mqttService: MqttService,private route: ActivatedRoute){}

  ngOnInit(): void {
    this.getCards();
  }  

  getCards() {
    this.id = this.route.snapshot.paramMap.get('groupId');

    this.mqttService.getGroups().subscribe((groups: { members: any[], id: number, friendly_name: string }[]) => {
      if (this.id!=null) {
        const filteredGroup = groups.filter(group => group.id.toString() === this.id);
        if (filteredGroup.length > 0) {
          this.setDevices(filteredGroup[0].members);
          this.groupName = filteredGroup[0].friendly_name;
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
    this.devices.push({
        "friendly_name": "Color",
        "controls": [
          {
            "access": 7,
            "description": "On/off state of this light",
            "label": "State",
            "name": "state",
            "property": "state",
            "type": "binary",
            "value_off": "OFF",
            "value_on": "ON",
            "value_toggle": "TOGGLE"
          },
          {
            "access": 7,
            "description": "Brightness of this light",
            "label": "Brightness",
            "name": "brightness",
            "property": "brightness",
            "type": "numeric",
            "value_max": 254,
            "value_min": 0
          },
          {
            "type": "composite",
            "name": "color_xy",
            "label": "Color xy",
            "access": 2,
            "property": "color",
            "features": [
              {
                "type": "numeric",
                "name": "x",
                "label": "X",
                "property": "x",
                "access": 7
              },
              {
                "type": "numeric",
                "name": "y",
                "label": "Y",
                "property": "y",
                "access": 7
              }
            ]
          },
          {
            "type": "composite",
            "name": "color_hs",
            "label": "Color HS",
            "access": 2,
            "property": "color",
            "features": [
              {
                "type": "numeric",
                "name": "hue",
                "label": "Hue",
                "property": "hue",
                "access": 7
              },
              {
                "type": "numeric",
                "name": "saturation",
                "label": "Saturation",
                "property": "saturation",
                "access": 7
              }
            ]
          },
          {
            "type": "composite",
            "name": "lock",
            "label": "Lock",
            "access": 7,
            "property": "lock",
            "features": [
              {
                "type": "binary",
                "name": "state",
                "label": "State",
                "property": "state",
                "value_on": "LOCK",
                "value_off": "UNLOCK",
                "access": 7
              },
              {
                "type": "enum",
                "name": "lock_state",
                "label": "Lock State",
                "property": "lock_state",
                "values": ["locked", "unlocked", "jammed", "unknown"],
                "access": 5
              },
              {
                "type": "numeric",
                "name": "battery",
                "label": "Battery Level",
                "property": "battery",
                "unit": "%",
                "access": 1
              }
            ]
          }
        ],
        "type": "light"
      });
    console.log(this.devices);
  }

  public getDevices(): any {
    this.devices;
  }
}

