import { Component, OnInit } from '@angular/core';
import { TourIssueNotification, TourIssueNotificationStatus } from '../../layout/model/tour-notification.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourAuthoringService } from '../tour-authoring.service';

interface AdventureCoinNotification {
  id: number;
  touristId: number;
  isRead: boolean;
  sentAt: Date;
}

@Component({
  selector: 'app-notification',
  templateUrl: './tour-notification.component.html',
  styleUrls: ['./tour-notification.component.css']
})
export class NotificationComponent implements OnInit {
  atBottom: boolean = false;
  user: any;
  notifications: TourIssueNotification[] = [];
  coinNotifications: AdventureCoinNotification[] = [];

  constructor(private service: TourAuthoringService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.loadNotifications();
      this.loadCoinNotifications();
    });
  }

  loadNotifications(): void {
    console.log("Fetching notifications for user ID:", this.user?.id);
    this.service.getNotifications(this.user.id).subscribe(result => {
      console.log("Notifications API response:", result);

      if (result && result.results) {
        this.notifications = result.results;
      } else {
        this.notifications = [];
      }

      console.log("Loaded notifications:", this.notifications);
    }, error => {
      console.error("Error loading notifications:", error);
    });
  }

  loadCoinNotifications(): void {
    this.service.getAdventureCoinNotifications().subscribe(result => {
      this.coinNotifications = result || [];
      console.log("Loaded coin notifications:", this.coinNotifications);
    }, error => {
      console.error("Error loading coin notifications:", error);
    });
  }

  markAsResolved(notification: TourIssueNotification) {
    notification.status = TourIssueNotificationStatus.Resolved;
  }

  markAsUnresolved(notification: TourIssueNotification) {
    notification.status = TourIssueNotificationStatus.Unresolved;
  }

  markCoinNotificationAsRead(notification: AdventureCoinNotification) {
    this.service.markCoinNotificationAsRead(notification.id).subscribe(() => {
      notification.isRead = true;
    });
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

  goToNotification(notification: TourIssueNotification): void {
    console.log('Navigating to notification with ID:', notification.tourIssueReportId);
    this.service.readNotifications(this.user.id, notification.tourIssueReportId);
    this.router.navigate(['/tourIssueManagement/' + notification.tourIssueReportId]);
  }

  MarkAllAsRead() {
    this.service.MarkAllAsRead(this.user.id).subscribe(() => {
      this.service.markAllCoinNotificationsAsRead(this.user.id).subscribe(() => {
        window.location.reload();
      });
    });
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const isAtBottom = target.scrollHeight - target.scrollTop === target.clientHeight;
    if (this.atBottom) {
      event.preventDefault();
      return;
    }
    this.atBottom = isAtBottom;
  }
}
