import { Component, OnInit } from '@angular/core';
import { MqttService } from '../../services/mqtt.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrl: './status-bar.component.css'
})
export class StatusBarComponent implements OnInit {
  isBridgeOnline: boolean = false;

  constructor(private mqttService: MqttService,private router: Router){}

  ngOnInit(): void {
    if(this.router.url!=='/virtual'){
      this.checkState();
    } else {
      this.isBridgeOnline=true;
    }
    
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        const navEnd = event as NavigationEnd;
        console.log(navEnd.url);
        if (navEnd.url === '/virtual' || navEnd.url.startsWith('/device/0v')) {
          this.isBridgeOnline = true;
          this.mqttService.unsubscribe(`${this.mqttService.getBaseTopic()}/bridge/state`);
        } else { 
          this.checkState();
        }
      });
  }
    
  checkState(){
    this.mqttService.checkBridgeState().subscribe(isOnline => {
      this.isBridgeOnline = isOnline;
    });
  }
}
