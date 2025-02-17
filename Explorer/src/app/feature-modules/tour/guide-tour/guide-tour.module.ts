import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GuideTourCreateComponent } from './guide-tour-create/guide-tour-create.component';
import { GuideTourComponent } from './guide-tour/guide-tour.component';
import { MapSelectorComponent } from '../../map-selector/map-selector.component';



@NgModule({
  declarations: [
    GuideTourCreateComponent,
    GuideTourComponent,
    MapSelectorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,    
  ],
  exports: [
    GuideTourComponent,
    GuideTourCreateComponent,
    MapSelectorComponent
  ]
})
export class GuideTourModule { }
