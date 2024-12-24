import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinWheelService {
  spinCompleted = new EventEmitter<void>(); // Emitovaće događaj kada spin završi
}
