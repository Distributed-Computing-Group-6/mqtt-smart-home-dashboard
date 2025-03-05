import { Component, Input, OnInit } from '@angular/core';
import { MqttService } from '../../../services/mqtt.service';

@Component({
    selector: 'app-basic-expose',
    templateUrl: './basic-expose.component.html',
    styleUrl: './basic-expose.component.css'
  })
export abstract class BasicExposeComponent implements OnInit{
    @Input() topic!: string;
    @Input() control!: any;
    accessArray!: string[];
    inputValue: any;

    constructor(public mqttService: MqttService){
    }

    ngOnInit(){
        this.listenForChange();
        this.startState();
    }

    getAccess(): string[] {
        return this.control.access.toString(2).split("");
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
            this.mqttService.getUpdate(this.topic, this.control.name, (value) => {
                this.handleChange(value);
              });
        }
    }

    stateChange(): void {}

    handleChange(value:any): void {
        this.inputValue = value;
    }

    startState(): void {}
}
