import { Component, OnInit } from '@angular/core';
import { TourIssueNotification, TourIssueNotificationStatus } from '../../layout/model/tour-notification.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourAuthoringService } from '../tour-authoring.service';
import { AdventureCoinNotification } from '../model/adventureCoinNotification.model';

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
            this.notifications = result.results.map(notification => ({
                ...notification,
                fromUsername: notification.fromUsername || 'Unknown',
                toUsername: notification.toUsername || 'Unknown',
                // Map status to the enum value if needed
                status: this.mapStatus(notification.status)
            }));
        } else {
            this.notifications = [];
        }
        console.log("Loaded notifications:", this.notifications);
    }, error => {
        console.error("Error loading notifications:", error);
    });
}

private mapStatus(status: string | number): TourIssueNotificationStatus {
    if (typeof status === 'string') {
        return status as TourIssueNotificationStatus;
    } else {
        switch (status) {
            case 0: return TourIssueNotificationStatus.Resolved;
            case 1: return TourIssueNotificationStatus.Unresolved;
            default: return TourIssueNotificationStatus.Unresolved; // Default to Pending
        }
    }
}

  

  loadCoinNotifications(): void {
    this.service.getAdventureCoinNotifications().subscribe(result => {
      this.coinNotifications = result || [];
      this.coinNotifications = this.coinNotifications.filter(n => !n.status);
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
      this.service.markAllCoinNotificationsAsRead().subscribe(() => {
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
