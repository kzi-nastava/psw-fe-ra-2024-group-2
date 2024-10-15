import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourIssueReportComponent } from './tour-issue-report/tour-issue-report.component';



@NgModule({
  declarations: [
    TourIssueReportComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    TourIssueReportComponent
  ]
})
export class TourExecutionModule { }
