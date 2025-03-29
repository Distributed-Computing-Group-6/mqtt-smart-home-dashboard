import { Component, Input, OnInit } from '@angular/core';
import { MqttService } from '../../../services/mqtt.service';

@Component({
    selector: 'app-basic-expose',
    templateUrl: './basic-expose.component.html',
    styleUrl: './basic-expose.component.css'
  })
export class BasicExposeComponent implements OnInit{
    @Input() friendly_name!: string;
    @Input() control!: any;
    @Input() isCard!: boolean;
    @Input() topic!: string;
    @Input() compositeProperty!: string;
    accessArray!: string[];
    inputValue: any;
    isBridgeOnline: boolean = false;

    constructor(public mqttService: MqttService) {}
  
    ngOnInit() {
        this.setTopic(); 
        this.setControlProperty();
        this.listenForChange();
        this.startState();
    }

    ngAfterViewInit(){
        this.checkState();
    }

    setTopic() {
        if(!this.topic){
            this.topic = `${this.mqttService.getBaseTopic()}/${this.friendly_name}`;
        }
    }
    
    setControlProperty(){
        if (this.compositeProperty!=null) {
            console.log(this.compositeProperty);
            this.control.property= `${this.compositeProperty}/${this.control.property}`;
        }
    }

    checkState(){
        this.mqttService.checkBridgeState().subscribe(isOnline => {
          this.isBridgeOnline = isOnline;
        //   this.invalidMessage = isOnline ? "" : "The bridge is offline. Please check your connection.";
        });
    }

    getAccess(): string[] {
        if(this.control.access){
            return this.control.access.toString(2).padStart(3, "0").split("");
        } else {
            return ["0","1","0"];
        }

    }
    
    canRead(): boolean {
        return this.getAccess()[0]=="1";
    }
    
    canWrite(): boolean {
        return this.getAccess()[1]=="1";
    }
    
    canPublish(): boolean {
        return this.getAccess()[2]=="1";
    }

    listenForChange(){
        if(this.canPublish()){
            this.mqttService.getUpdate(this.topic, this.control.property, (value) => {
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
