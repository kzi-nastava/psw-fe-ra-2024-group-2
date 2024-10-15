import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyToursComponent } from './mytours/mytours.component';
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { EditTourComponent } from './edittour/edittour.component';
import { CheckpointComponent } from './checkpoint/checkpoint.component';



@NgModule({
  declarations: [
    MyToursComponent,
    EditTourComponent,
    CheckpointComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    CheckpointComponent
  ]
})
export class TourAuthoringModule { }
