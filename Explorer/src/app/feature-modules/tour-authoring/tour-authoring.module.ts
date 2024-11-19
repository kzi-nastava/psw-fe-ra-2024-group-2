import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { ClubComponent } from './club/club.component';
import { EditTourComponent } from './edittour/edittour.component';
import { MyToursComponent } from './mytours/mytours.component';
import { ObjectFormComponent } from './object-form/object-form.component';
import { ObjectComponent } from './object/object.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddNewTourComponent } from './addNewTour/addNewTour.component'; 
import { NotificationComponent } from './tour-notification/tour-notification.component';
import { ObjectUpdateComponent } from './object-update/object-update.component';
import { PositionSimulatorComponent } from '../stakeholders/position-simulator/position-simulator.component';
import { FormsModule } from '@angular/forms';
import { TourPreferenceComponent } from './tour-preference/tour-preference.component';
import { EventFormComponent } from './event-form/event-form.component';
import { EventComponent } from './event/event.component';
@NgModule({
  declarations: [
    MyToursComponent,
    EditTourComponent,
    ClubComponent,
    ObjectComponent,
    ObjectFormComponent, 
    ObjectUpdateComponent,
    AddNewTourComponent,
    PositionSimulatorComponent,
    NotificationComponent,
    TourPreferenceComponent,
    EventFormComponent,
    EventComponent
  ],
  imports: [
    CommonModule,
    MaterialModule, 
    ReactiveFormsModule,
    SharedModule,
    FormsModule
  ],
  exports: [
    ObjectComponent,
    ObjectFormComponent,
    MaterialModule,
    ReactiveFormsModule,
    NotificationComponent
  ]
})
export class TourAuthoringModule { }
