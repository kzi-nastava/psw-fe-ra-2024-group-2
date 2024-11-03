import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../infrastructure/auth/auth.service';
import { TourExecutionService } from '../tour-execution.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { TourIssueComment } from '../model/tour-issue-comment.model';
import { PagedResult } from '../../tour-authoring/shared/model/tour.module';
import { TourIssueReport } from '../model/tour-issue-report.model';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Tour } from '../model/tour-model';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  showCommentOverlay: boolean = false; 
  commentText: string = ''; 
  actionsDisabled: boolean = false;
  showAlertAdminOverlay: boolean = false;
  alertedAdmin: boolean = false;
  isAlertDisabled: boolean = true;

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
    try {
      await this.getTourIssueReport();
      await this.getTour(); 
      await this.getComments(); 
      this.isAlertDisabled = this.isAlertAdminDisabled();
    } catch (err) {
      console.log(err);
    }
  }

  openCommentOverlay() {
    this.showCommentOverlay = true;
  }

  closeOverlay() {
    this.showCommentOverlay = false;
    this.commentText = '';
  }

  openAlertAdminOverlay() {
    this.showAlertAdminOverlay = true;
  }

  closeAlertAdminOverlay() {
    this.showAlertAdminOverlay = false;
  }

  isAlertAdminDisabled(): boolean {
    if (!this.tourIssueReport) {
        return true;
    }
    const isStatusOne = this.tourIssueReport.status === 1;
    const isFixUntilExpired = new Date(this.tourIssueReport.fixUntil) < new Date();
    return isStatusOne || isFixUntilExpired;
  }

  async confirmComment(): Promise<void> {
    if (this.commentText.trim()) {
      const newComment: TourIssueComment = {
        id: 0,
        userId: this.user.id,
        comment: "Problem resolved: " + this.commentText,
        publishedAt: new Date().toISOString(),
        tourIssueReportId: this.tourIssueReportId
      };

      const addComment$ = this.service.addTourIssueComment(newComment).pipe(
        tap((result) => {
          this.comments.push(result); 
        })
      );

      const markAsDone$ = this.service.markAsDone(this.tourIssueReport).pipe(
        map((response) => {
          this.tourIssueReport.status = response.status; 
        })
      );

      forkJoin([addComment$, markAsDone$]).subscribe({
        next: () => {
          this.closeOverlay();
          this.actionsDisabled = true;
          this.disableActions();
          this.isAlertDisabled = this.isAlertAdminDisabled();
        },
        error: (err) => {
          console.log("Error adding comment or updating status: ", err);
        }
      });
    }
  }

  disableActions() {
    this.showCommentOverlay = false;
    document.querySelector(".header-buttons button")?.setAttribute("disabled", "true");
    document.querySelector(".input-container")?.classList.add("disabled");
  }

 confirmAlertAdmin(): void {
    if (!this.alertedAdmin) {
        this.service.alertAdmin(this.tourIssueReport).subscribe({
        next: () => {
          this.alertedAdmin = true;
          this.isAlertDisabled = this.isAlertAdminDisabled();
          this.closeAlertAdminOverlay();
        },
        error: (err) => {
          console.log("Error alerting admin:", err);
        }
      });
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
        this.isAlertDisabled = this.isAlertAdminDisabled();
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
}
