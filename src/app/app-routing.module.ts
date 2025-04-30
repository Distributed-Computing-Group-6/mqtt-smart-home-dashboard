import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guard/auth.guard';
import { LogoutComponent } from './components/logout/logout.component';
import { MainComponent } from './components/main/main.component';
import { GroupsPageComponent } from './components/group/groups-page/groups-page.component';
import { DevicePageComponent } from './components/device-page/device-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        component: DashboardComponent,
      },
      {
        path: 'groups',
        component: GroupsPageComponent,
      },
      {
        path: 'virtual',
        component: DashboardComponent,
      },
      {
        path: 'groups/:groupId',
        component: DashboardComponent,
      },
      {
        path: 'device/:deviceId',
        component: DevicePageComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
