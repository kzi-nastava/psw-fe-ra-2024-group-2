import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RatingApplicationComponent } from './rating-application/rating-application.component';
import { AccountManagementComponent } from './account-management/account-management.component';
import { ToursitClubComponent } from './toursit-club/toursit-club.component';
import { ObjectsManagementComponent } from '../tour-authoring/objects-management/objects-management.component';
import { TouristEquipmentComponent } from './tourist-equipment/tourist-equipment.component';
import { FaqComponent } from './faq/faq.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    AccountManagementComponent,
    ToursitClubComponent,
    RatingApplicationComponent,
    AccountManagementComponent,
    ObjectsManagementComponent,
    TouristEquipmentComponent,
    FaqComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    BrowserModule,
    FormsModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    RatingApplicationComponent,
    AccountManagementComponent,
    TouristEquipmentComponent
  ]
})
export class AdministrationModule { }
