import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LogoutComponent } from './components/logout/logout.component';
import { DeviceComponent } from './components/device/device.component';
import { BinaryComponent } from './components/control/binary/binary.component';
import { NumericComponent } from './components/control/numeric/numeric.component';
import { EnumComponent } from './components/control/enum/enum.component';
import { BasicExposeComponent } from './components/control/basic-expose/basic-expose.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    LogoutComponent,
    DeviceComponent,
    BasicExposeComponent,
    BinaryComponent,
    NumericComponent,
    EnumComponent
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
