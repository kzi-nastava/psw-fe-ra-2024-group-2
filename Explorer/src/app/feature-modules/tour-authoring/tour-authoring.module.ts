import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { ClubComponent } from './club/club/club.component';
import { EditTourComponent } from './edittour/edittour.component';
import { MyToursComponent } from './mytours/mytours.component';
import { ObjectFormComponent } from './object-form/object-form.component';
import { ObjectComponent } from './object/object.component';

import { AddtourComponent } from './addtour/addtour.component';
@NgModule({
  declarations: [
    MyToursComponent,
    EditTourComponent,
    ClubComponent,
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
    ObjectFormComponent,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class TourAuthoringModule { }
