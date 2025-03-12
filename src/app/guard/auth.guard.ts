import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MqttService } from '../services/mqtt.service';

export const authGuard: CanActivateFn = (route, state) => {
  const mqttService = inject(MqttService);
  const router = inject(Router);

  if (mqttService.isConnected()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false; 
  }
};
