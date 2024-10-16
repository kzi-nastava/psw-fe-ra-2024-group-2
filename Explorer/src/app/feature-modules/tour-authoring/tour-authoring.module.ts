import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyToursComponent } from './mytours/mytours.component';
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { EditTourComponent } from './edittour/edittour.component';
import { CheckpointComponent } from './checkpoint/checkpoint.component';
import { CheckpointFormComponent } from './checkpoint-form/checkpoint-form.component';
import { ReactiveFormsModule } from '@angular/forms';  // <-- Import this



@NgModule({
  declarations: [
    MyToursComponent,
    EditTourComponent,
    CheckpointComponent,
    CheckpointFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    CheckpointComponent
  ]
})
export class TourAuthoringModule { }
