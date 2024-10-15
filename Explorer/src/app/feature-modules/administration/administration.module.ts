import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountManagementComponent } from './account-management/account-management.component';



@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
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
    AccountManagementComponent
  ]
})
export class AdministrationModule { }
