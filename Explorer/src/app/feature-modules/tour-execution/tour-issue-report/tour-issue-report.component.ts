import { Component, OnInit } from '@angular/core';
import { TourIssueReport } from '../model/tour-issue-report.model';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResult } from '../../tour-authoring/shared/model/tour.module';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourIssueReportName } from '../model/tour-issue-report-w-name';

@Component({
  selector: 'xp-tour-issue-report',
  templateUrl: './tour-issue-report.component.html',
  styleUrls: ['./tour-issue-report.component.css']
})
export class TourIssueReportComponent implements OnInit {
  tourIssueReport: TourIssueReport[] = [];
  tourIssueReportName: TourIssueReportName[] = [];

  constructor(private service: TourExecutionService) {}

  ngOnInit(): void {
    this.loadTourIssueReports();
  }

  private loadTourIssueReports(): void {
    this.service.getTourIssueReport().subscribe({
      next: (result: PagedResult<TourIssueReport>) => {
        this.tourIssueReport = result.results;
        console.log('Initial Tour Issue Report:', this.tourIssueReport); 
        this.fetchTourNames();
      },
      error: (err: any) => console.error('Failed to load reports', err)
    });
  }

  private fetchTourNames(): void {
    const tourRequests = this.tourIssueReport.map(report => this.fetchTourName(report));
    
    
    Promise.all(tourRequests).then(updatedReports => {
      this.tourIssueReportName = updatedReports;
      console.log('Updated Tour Issue Report Names:', this.tourIssueReportName); 
    });
  }

  private fetchTourName(report: TourIssueReport): Promise<TourIssueReportName> {
    return new Promise((resolve, reject) => {
      this.service.getById(report.tourId).subscribe({
        next: (tour: Tour) => {
          console.log('Fetched tour:', tour); 
          resolve({
            tourName: tour.name,
            category: report.category,
            description: report.description,
            priority: report.priority,
            dateTime: report.dateTime
          });
        },
        error: (err) => {
          console.error(`Failed to fetch tour for ID ${report.tourId}:`, err);
          reject(err);
        }
      });
    });
  }
}
