import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyToursComponent } from './mytours/mytours.component';
import { EditTourComponent } from './edittour/edittour.component';



@NgModule({
  declarations: [
    MyToursComponent,
    EditTourComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TourAuthoringModule { }
