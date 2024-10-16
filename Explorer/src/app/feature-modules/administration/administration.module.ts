import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RatingApplicationComponent } from './rating-application/rating-application.component';
import { AccountManagementComponent } from './account-management/account-management.component';
import { ToursitClubComponent } from './toursit-club/toursit-club.component';



@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    AccountManagementComponent,
    ToursitClubComponent,
    RatingApplicationComponent,
    AccountManagementComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    RatingApplicationComponent,
    AccountManagementComponent
  ]
})
export class AdministrationModule { }
