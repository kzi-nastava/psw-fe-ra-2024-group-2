import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'xp-profile-messaging-main',
  templateUrl: './profile-messaging-main.component.html',
  styleUrls: ['./profile-messaging-main.component.css']
})
export class ProfileMessagingMainComponent implements OnInit {
  selectedUserId?: number;
  isLoading = false;

  ngOnInit(): void {}

  openChat(userId: number): void {
    this.selectedUserId = userId;
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
    }, 400);
  
  }
  
}
