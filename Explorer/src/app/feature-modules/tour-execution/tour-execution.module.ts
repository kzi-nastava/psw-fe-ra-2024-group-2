import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourReviewComponent } from './tour-review/tour-review.component';
import { ToursComponent } from './tours/tours.component';
import { TourReviewFormComponent } from './tour-review-form/tour-review-form.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { TourIssueReportComponent } from './tour-issue-report/tour-issue-report.component';
import { TourReportingComponent } from './tour-reporting/tour-reporting.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';
import { TourIssueManagementComponent } from './tour-issue-management/tour-issue-management.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [
    TourReviewComponent,
    ToursComponent,
    TourReviewFormComponent,
    TourIssueReportComponent,
    TourReportingComponent,
    ReportFormComponent,
    TourIssueManagementComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports:[
    TourReviewComponent,
    ToursComponent,
    TourIssueReportComponent,
    TourReportingComponent,
    ReportFormComponent,
    TourIssueManagementComponent
  ]
})
export class TourExecutionModule { }
