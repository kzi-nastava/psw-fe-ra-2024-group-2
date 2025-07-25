import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GuideTourCreateComponent } from './guide-tour-create/guide-tour-create.component';
import { GuideTourComponent } from './guide-tour/guide-tour.component';
import { MapSelectorComponent } from '../../map-selector/map-selector.component';
import { RateTourComponent } from '../tourist-tour/rate-tour/rate-tour.component';
import { GuideTourRatesComponent } from './guide-tour-rates/guide-tour-rates.component';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [
    GuideTourCreateComponent,
    GuideTourComponent,
    MapSelectorComponent,
    RateTourComponent,
    GuideTourRatesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  exports: [
    GuideTourComponent,
    GuideTourCreateComponent,
    MapSelectorComponent,
    RateTourComponent
  ]
})
export class GuideTourModule { }
