import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { ProfileService } from '../profile.service';
import { Profile } from '../model/profile.model';

@Component({
  selector: 'xp-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.css']
})
export class ChatSidebarComponent implements OnInit {
  @ViewChild('usersList') usersList!: ElementRef;
  users: Profile[] = [];
  currentUserId!: number;

  @Output() userSelected = new EventEmitter<number>();

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe(user => {
      this.currentUserId = user.id;
      this.loadUsers();
    });
  }

loadUsers(): void {
  this.profileService.getAllRaw().subscribe(users => {
    if (Array.isArray(users)) {
      this.users = users.filter(u => u.id !== this.currentUserId);
    } else {
      console.error('Expected array but got:', users);
      this.users = [];
    }
  });
}


  selectUser(userId: number): void {
    this.userSelected.emit(userId);
  }

scrollUp() {
  const element = this.usersList.nativeElement;
  element.scrollBy({ top: -100, behavior: 'smooth' });
}

scrollDown() {
  const element = this.usersList.nativeElement;
  element.scrollBy({ top: 100, behavior: 'smooth' });
}

  canScrollUp(): boolean {
    const element = this.usersList?.nativeElement;
    return element && element.scrollTop > 0;
  }

  canScrollDown(): boolean {
    const element = this.usersList?.nativeElement;
    return element && (element.scrollTop < element.scrollHeight - element.clientHeight);
  }
}
