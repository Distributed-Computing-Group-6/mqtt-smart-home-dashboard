import { Component, OnInit } from '@angular/core';
import { MqttService } from '../../services/mqtt.service';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrl: './status-bar.component.css'
})
export class StatusBarComponent implements OnInit {
  isBridgeOnline: boolean = false;

  constructor(private mqttService: MqttService){}

  ngOnInit(): void {
    this.checkState();
    }
    
  checkState(){
    this.mqttService.checkBridgeState().subscribe(isOnline => {
      this.isBridgeOnline = isOnline;
    });
  }
}
