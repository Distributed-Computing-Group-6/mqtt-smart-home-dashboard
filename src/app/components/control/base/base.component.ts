import { Component, Input, OnInit } from '@angular/core';
import { MqttService } from '../../../services/mqtt.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrl: './base.component.css'
})
export abstract class BaseComponent implements OnInit{
    @Input() topic!: string;
    @Input() feature!: any;
    accessArray!: string[];
    inputValue: any;

    constructor(public mqttService: MqttService){
    }

    ngOnInit(){
        this.listenForChange();
        this.startState();
    }

    getAccess(): string[] {
        return this.feature.access.toString(2).split("");
    }
    
    canRead(): boolean {
        return this.getAccess()[2]=="1";
    }
    
    canWrite(): boolean {
        return this.getAccess()[1]=="1";
    }
    
    canPublish(): boolean {
        return this.getAccess()[0]=="1";
    }

    listenForChange(){
        if(this.canPublish()){
            this.mqttService.getUpdate(this.topic, this.feature.name, (value) => {
                this.handleChange(value);
              });
        }
    }

    handleChange(value:any) {}

    startState() {}
}
