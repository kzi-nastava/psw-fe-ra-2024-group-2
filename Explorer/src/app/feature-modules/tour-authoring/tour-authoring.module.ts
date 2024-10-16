import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyToursComponent } from './mytours/mytours.component';
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { EditTourComponent } from './edittour/edittour.component';
import { ObjectComponent } from './object/object.component';
import { ObjectFormComponent } from './object-form/object-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckpointComponent } from './checkpoint/checkpoint.component';
import { CheckpointFormComponent } from './checkpoint-form/checkpoint-form.component';

import { AddtourComponent } from './addtour/addtour.component';
@NgModule({
  declarations: [
    MyToursComponent,
    EditTourComponent,
    CheckpointComponent,
    CheckpointFormComponent,
    ObjectComponent,
    ObjectFormComponent, 
    AddtourComponent
  ],
  imports: [
    CommonModule,
    MaterialModule, 
    ReactiveFormsModule
  ],
  exports: [
    ObjectComponent,
    ObjectFormComponent
  ],
})
export class TourAuthoringModule { }
