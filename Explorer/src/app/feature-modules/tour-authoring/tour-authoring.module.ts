import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyToursComponent } from './mytours/mytours.component';
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { EditTourComponent } from './edittour/edittour.component';
import { ObjectComponent } from './object/object.component';
import { ObjectFormComponent } from './object-form/object-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [
    MyToursComponent,
    EditTourComponent,
    ObjectComponent,
    ObjectFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule, 
    MatOptionModule,
    MatInputModule,
    MatFormFieldModule, 
  ]
})
export class TourAuthoringModule { }
