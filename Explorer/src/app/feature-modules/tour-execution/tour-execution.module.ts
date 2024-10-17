import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourReviewComponent } from './tour-review/tour-review.component';
import { ToursComponent } from './tours/tours.component';
import { TourReviewFormComponent } from './tour-review-form/tour-review-form.component';


import { TourIssueReportComponent } from './tour-issue-report/tour-issue-report.component';
import { TourReportingComponent } from './tour-reporting/tour-reporting.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TourReviewComponent,
    ToursComponent,
    TourReviewFormComponent,
    TourIssueReportComponent,
    TourReportingComponent,
    ReportFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[
    TourReviewComponent,
    ToursComponent,
    TourIssueReportComponent,
    TourReportingComponent,
    ReportFormComponent
  ]
})
export class TourExecutionModule { }
