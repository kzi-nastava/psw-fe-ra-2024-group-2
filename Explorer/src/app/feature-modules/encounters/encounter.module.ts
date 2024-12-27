import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule }  from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { EncounterComponent } from './encounter/encounter.component';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { EncounterExecutionComponent } from './encounter-execution/encounter-execution.component';
import { MapEncounterComponent } from './map-encounter/map-encounter.component';
import { CompleteChallengeDialogComponent } from './complete-challenge-dialog/complete-challenge-dialog.component';

@NgModule({
  declarations: [
    EncounterComponent,
    EncounterExecutionComponent,
    MapEncounterComponent,
    CompleteChallengeDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    RouterModule.forChild([
      { path: '', component: EncounterComponent }
    ])
  ]
})
export class EncountersModule { }