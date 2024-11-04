import { Component, OnInit } from '@angular/core';
import { TourIssueReport } from '../model/tour-issue-report.model';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResult } from '../../tour-authoring/shared/model/tour.module';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourIssueReportName } from '../model/tour-issue-report-w-name';
import { Router } from '@angular/router';
import { AuthService } from '../../../infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tour-issue-report',
  templateUrl: './tour-issue-report.component.html',
  styleUrls: ['./tour-issue-report.component.css']
})
export class TourIssueReportComponent implements OnInit {
  tourIssueReport: TourIssueReport[] = [];
  tourIssueReportName: TourIssueReportName[] = [];
  user: any;
  today: Date = new Date();

  constructor(private service: TourExecutionService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.loadTourIssueReports();
  }

  private loadTourIssueReports(): void {
    console.log(this.user.id)
    this.service.getTourIssueReport(this.user.id).subscribe({
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
      this.service.getTourById(report.tourId).subscribe({
        next: (tour: Tour) => {
          //console.log('Fetched tour:', tour); 
          resolve({
            tourName: tour.name,
            category: report.category,
            description: report.description,
            priority: report.priority,
            createdAt: report.createdAt,
            fixUntil: report.fixUntil,
            status: report.status,
            id: report.id,
            tourId: report.tourId,
            userId: report.userId
          });
        },
        error: (err) => {
          console.error(`Failed to fetch tour for ID ${report.tourId}:`, err);
          reject(err);
        }
      });
    });
  }

  public checkReport(report: TourIssueReport){
    this.router.navigate(['/tourIssueManagement/'+report.id])
  }

  public getStatus(status: number): string {
    switch (status) {
      case 0:
        return 'Open';
      case 1:
        return 'Closed';
      default:
        return 'Unknown';
    }
  }

  public isExpired(fixUntil: string): boolean {
    if(this.user.role === 'administrator'){
      return fixUntil ? new Date(fixUntil) < this.today : false;
    }
    return false
  }
}
