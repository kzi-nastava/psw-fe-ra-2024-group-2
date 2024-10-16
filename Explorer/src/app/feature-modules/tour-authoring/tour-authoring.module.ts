import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyToursComponent } from './mytours/mytours.component';
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { EditTourComponent } from './edittour/edittour.component';
import { AddtourComponent } from './addtour/addtour.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    MyToursComponent,
    EditTourComponent,
    AddtourComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class TourAuthoringModule { }
