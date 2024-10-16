import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourIssueReportComponent } from './tour-issue-report/tour-issue-report.component';
import { TourReportingComponent } from './tour-reporting/tour-reporting.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TourIssueReportComponent,
    TourReportingComponent,
    ReportFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    TourIssueReportComponent
  ]
})
export class TourExecutionModule { }
