import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyToursComponent } from './mytours/mytours.component';
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { EditTourComponent } from './edittour/edittour.component';
import { ObjectComponent } from './object/object.component';



@NgModule({
  declarations: [
    MyToursComponent,
    EditTourComponent,
    ObjectComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class TourAuthoringModule { }
