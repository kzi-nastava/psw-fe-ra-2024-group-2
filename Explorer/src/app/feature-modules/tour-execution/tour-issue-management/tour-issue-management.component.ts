import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../infrastructure/auth/auth.service';
import { TourExecutionService } from '../tour-execution.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { TourIssueComment } from '../model/tour-issue-comment.model';
import { PagedResult } from '../../tour-authoring/shared/model/tour.module';
import { TourIssueReport } from '../model/tour-issue-report.model';
import { Observable } from 'rxjs';
import { Tour } from '../model/tour-model';

@Component({
  selector: 'xp-tour-issue-management',
  templateUrl: './tour-issue-management.component.html',
  styleUrls: ['./tour-issue-management.component.css']
})
export class TourIssueManagementComponent implements OnInit{
  user: any;
  comments: TourIssueComment[] = [];
  tourIssueReportId: number;
  tourIssueReport: TourIssueReport;
  tour: Tour;
  showSetFixUntilDateOverlay: boolean;
  showCloseReportOverlay: boolean;
  showCloseTourOverlay: boolean;
  FixUntilDate: Date;
  FixUntilTime: string; // Promenljiva za vreme u formatu "HH:mm"
  today: Date = new Date();

  constructor(private authService: AuthService, private service: TourExecutionService, 
              private router: Router, private route: ActivatedRoute){ }
  
  async ngOnInit(): Promise<void> {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.route.paramMap.subscribe(params => {
      const id = params.get('tourIssueReportId');
      if (id !== null) {
        this.tourIssueReportId = +id;
      } else {
        this.tourIssueReportId = 0; 
      }
    });
    console.log('TOUR ISSUE REPORT ID: '+this.tourIssueReportId)
    try {
      await this.getTourIssueReport();
      await this.getTour();
      await this.getComments();
    } catch (err) {
      console.log(err);
    }
  }
  async getComments(): Promise<void> {
    try {
      const result = await this.service.getTourIssueComments(this.tourIssueReportId).toPromise();
      if (result && result.results) {
        this.comments = result.results;
        this.comments.sort((a, b) => {
          const dateA = new Date(a.publishedAt).getTime();
          const dateB = new Date(b.publishedAt).getTime();
          return dateA - dateB;
        });
      } else {
        console.log("No comments found or result is undefined.");
      }
    } catch (err) {
      console.log(err);
    }
  }
  
  async getTourIssueReport(): Promise<void> {
    try {
      const result = await this.service.getTourIssueReportById(this.tourIssueReportId).toPromise();
      if (result) {
        this.tourIssueReport = result;
      } else {
        console.log("Tour issue report not found or result is undefined.");
      }    } catch (err) {
      console.log(err);
    }
  }
  
  async getTour(): Promise<void> {
    try {
      if (this.tourIssueReport && this.tourIssueReport.tourId) {
        const result = await this.service.getTourById(this.tourIssueReport.tourId).toPromise();
        if (result) {
          this.tour = result;
        } else {
          console.log("Tour not found or result is undefined.");
        }
      } else {
        console.log("Tour ID is undefined in tourIssueReport.");
      }    } catch (err) {
      console.log(err);
    }
  }
  async PostComment(commentText: string): Promise<void> {
    if (commentText.trim()) {
      const newComment: TourIssueComment = {
        id: 0,
        userId: this.user.id,
        comment: commentText,
        publishedAt: new Date().toISOString(),
        tourIssueReportId: this.tourIssueReportId
      };
  
      //this.comments.push(newComment);

      this.service.addTourIssueComment(newComment).subscribe({
        next: async (result) => {
          await this.comments.push(result);
        },
        error: (err) => {
          console.log("Error posting comment:", err);
        },
      });
    }
  }

  getStatus(status: number): string{
    switch (status) {
      case 0:
        return 'Open';
      case 1:
        return 'Closed';
      default:
        return 'Unknown';
    }
  }

  async CloseTourIssueReport(): Promise<void>{
    await this.service.closeTourIssueReport(this.tourIssueReport).subscribe({
      next: (result) => {
        this.tourIssueReport.status = result.status
      },
      error: (err) => {
        console.log("Error posting comment:", err);
      },
    });
    this.showCloseReportOverlay = false
  }

  async SetFixUntilDate(): Promise<void>{
    if (this.FixUntilDate && this.FixUntilTime) 
    {
      const [hours, minutes] = this.FixUntilTime.split(':');
      const combinedDateTime = new Date(this.FixUntilDate);
      combinedDateTime.setHours(+hours);
      combinedDateTime.setMinutes(+minutes);
      this.tourIssueReport.fixUntil = combinedDateTime.toISOString()
    }
    else if(this.FixUntilDate)
    {
      this.tourIssueReport.fixUntil = this.FixUntilDate.toISOString()
    }
    
    await this.service.setReportFixUntilDate(this.tourIssueReport, this.user.id).subscribe({
      next: (result) => {
        this.tourIssueReport.fixUntil = result.fixUntil
      },
      error: (err) => {
        console.log("Error posting comment:", err);
      },
    });

    this.showSetFixUntilDateOverlay = false
  }

  async CloseTour(): Promise<void>{
    await this.service.closeTour(this.tour.id).subscribe({
      next: (result) => {
        this.router.navigate(['/tourIssueReport'])
      },
      error: (err) => {
        console.log("Error posting comment:", err);
      },
    });
  }
}
