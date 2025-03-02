import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LightComponent } from './components/devices/light/light.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LogoutComponent } from './components/logout/logout.component';
import { SwitchComponent } from './components/devices/switch/switch.component';
import { DeviceComponent } from './components/devices/device/device.component';

@NgModule({
  declarations: [
    AppComponent,
    LightComponent,
    LoginComponent,
    DashboardComponent,
    LogoutComponent,
    SwitchComponent,
    DeviceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
