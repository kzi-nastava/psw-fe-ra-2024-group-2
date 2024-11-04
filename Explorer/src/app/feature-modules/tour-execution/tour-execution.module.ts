import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourReviewComponent } from './tour-review/tour-review.component';
import { ToursComponent } from './tours/tours.component';
import { TourReviewFormComponent } from './tour-review-form/tour-review-form.component';
<<<<<<< HEAD

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

=======
>>>>>>> bfea6a050d57e4a018defa843b1efc497b09cea8
import { TourIssueReportComponent } from './tour-issue-report/tour-issue-report.component';
import { TourReportingComponent } from './tour-reporting/tour-reporting.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';
<<<<<<< HEAD
import { TourIssueManagementComponent } from './tour-issue-management/tour-issue-management.component';
=======
import { SearchToursComponent } from './search-tours/search-tours.component';
import { MapComponent } from 'src/app/shared/map/map.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
>>>>>>> bfea6a050d57e4a018defa843b1efc497b09cea8


@NgModule({
  declarations: [
    TourReviewComponent,
    ToursComponent,
    TourReviewFormComponent,
    TourIssueReportComponent,
    TourReportingComponent,
    ReportFormComponent,
<<<<<<< HEAD
    TourIssueManagementComponent
=======
    SearchToursComponent
>>>>>>> bfea6a050d57e4a018defa843b1efc497b09cea8
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
<<<<<<< HEAD
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule
=======
    SharedModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule
>>>>>>> bfea6a050d57e4a018defa843b1efc497b09cea8
  ],
  exports:[
    TourReviewComponent,
    ToursComponent,
    TourIssueReportComponent,
    TourReportingComponent,
    ReportFormComponent,
<<<<<<< HEAD
    TourIssueManagementComponent
=======
    SearchToursComponent
>>>>>>> bfea6a050d57e4a018defa843b1efc497b09cea8
  ]
})
export class TourExecutionModule { }
