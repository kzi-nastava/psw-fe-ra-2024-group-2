import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { ClubComponent } from './club/club/club.component';
import { EditTourComponent } from './edittour/edittour.component';
import { MyToursComponent } from './mytours/mytours.component';
import { ObjectFormComponent } from './object-form/object-form.component';
import { CheckpointComponent } from './checkpoint/checkpoint.component';
import { CheckpointFormComponent } from './checkpoint-form/checkpoint-form.component';
import { ObjectComponent } from './object/object.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { AddtourComponent } from './addtour/addtour.component';
import { ObjectUpdateComponent } from './object-update/object-update.component';
@NgModule({
  declarations: [
    MyToursComponent,
    EditTourComponent,
    ClubComponent,
    CheckpointComponent,
    CheckpointFormComponent,
    ObjectComponent,
    ObjectFormComponent, 
    AddtourComponent, ObjectUpdateComponent
  ],
  imports: [
    CommonModule,
    MaterialModule, 
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    ObjectComponent,
    ObjectFormComponent,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class TourAuthoringModule { }
