import { Component } from '@angular/core';
import { TourIssueNotification, TourIssueNotificationStatus } from '../../layout/model/tour-notification.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourAuthoringService } from '../tour-authoring.service';

@Component({
  selector: 'app-notification',
  templateUrl: './tour-notification.component.html',
  styleUrls: ['./tour-notification.component.css']
})

export class NotificationComponent {
  atBottom: boolean = false;
  user: any;
  notifications: TourIssueNotification[] = [];
  constructor(private service: TourAuthoringService,private router: Router, private authService: AuthService){ }
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.loadNotifications();
  }
  loadNotifications():void{
    this.service.getNotifications(this.user.id).subscribe(result =>{
      this.notifications=result.results;
      console.log(this.user.id)
    });
  }
  markAsResolved(notification: TourIssueNotification) {
    notification.status = TourIssueNotificationStatus.Resolved;
  }

  markAsUnresolved(notification: TourIssueNotification) {
    notification.status = TourIssueNotificationStatus.Unresolved;
  }

  getStatusClass(status: TourIssueNotificationStatus): string {
    switch (status) {
      case TourIssueNotificationStatus.Resolved:
        return 'text-success';
      case TourIssueNotificationStatus.Unresolved:
        return 'text-error';
      default:
        return 'text-primary';
    }
  }
  goToNotification(notification:TourIssueNotification):void{
    this.service.readNotifications(this.user.id,notification.tourIssueReportId)
    this.router.navigate(['/tourIssueManagement/'+notification.tourIssueReportId])
  }
  MarkAllAsRead() {
    this.service.MarkAllAsRead(this.user.id).subscribe(()=>{
      window.location.reload();
    });
  }
  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const isAtBottom = target.scrollHeight - target.scrollTop === target.clientHeight;

    // If at the bottom, disable scrolling by preventing default behavior
    if (this.atBottom) {
      event.preventDefault();
      return;
    }

    // Update the atBottom property based on scroll position
    this.atBottom = isAtBottom;

    if (this.atBottom) {
      console.log('You are at the bottom of the notifications.');
    }
}
}
