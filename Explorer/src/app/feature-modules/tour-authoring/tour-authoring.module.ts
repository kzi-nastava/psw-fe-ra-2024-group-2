import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { ClubComponent } from './club/club/club.component';
import { EditTourComponent } from './edittour/edittour.component';
import { MyToursComponent } from './mytours/mytours.component';



@NgModule({
  declarations: [
    MyToursComponent,
    EditTourComponent,
    ClubComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class TourAuthoringModule { }
