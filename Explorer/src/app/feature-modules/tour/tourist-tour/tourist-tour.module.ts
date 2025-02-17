import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TouristTourComponent } from './tourist-tour/tourist-tour.component';
import { BasketComponent } from './basket/basket.component';
import { GuideTourModule } from '../guide-tour/guide-tour.module';



@NgModule({
  declarations: [
    TouristTourComponent,
    BasketComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,  
    GuideTourModule  
  ],
  exports: [
    TouristTourComponent,
    BasketComponent
  ]
})
export class TouristTourModule { }
