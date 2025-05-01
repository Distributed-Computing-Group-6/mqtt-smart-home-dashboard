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
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './components/main/main.component';
import { ColorComponent } from './components/control/composite/color/color.component';
import { CompositeComponent } from './components/control/composite/composite.component';
import { DevicePageComponent } from './components/device-page/device-page.component';
import { GroupsPageComponent } from './components/group/groups-page/groups-page.component';
import { GroupCardComponent } from './components/group/group-card/group-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './components/modal/modal.component';
import { StatusBarComponent } from './components/status-bar/status-bar.component';
import { TextComponent } from './components/control/text/text.component';

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
    EnumComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    ColorComponent,
    CompositeComponent,
    DevicePageComponent,
    GroupsPageComponent,
    GroupCardComponent,
    ModalComponent,
    StatusBarComponent,
    TextComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
