// send-message.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { Profile } from '../model/profile.model';
import { ProfileMessage } from '../model/profile-message.model';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit {
  messageForm: FormGroup;
  users: Profile[] = [];
  currentUsername: string = '';
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {
    this.messageForm = this.fb.group({
      recipientId: ['', Validators.required],
      text: ['', [Validators.required, Validators.maxLength(280)]],
      resource: ['']
    });
  }

  ngOnInit(): void {
    this.loadCurrentUserAndOthers();
  }

  loadCurrentUserAndOthers(): void {
    this.profileService.getProfile().subscribe({
      next: (currentUser) => {
        this.currentUsername = currentUser.username;
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error loading current user:', err);
        this.error = 'Failed to load current user';
      }
    });
  }

  loadUsers(): void {
    this.profileService.getAll().subscribe({
      next: (response: any) => {
        console.log('Raw response:', response); 
        // Pristupamo value propertiju iz Result<T>
        const usersArray = response.value;  
        this.users = usersArray.filter((user: Profile) => user.username !== this.currentUsername)
        console.log('Filtered users:', this.users);
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = 'Failed to load users';
        this.users = []; 
      }
    });
  }

  onSubmit(): void {
    if (this.messageForm.valid) {
      this.loading = true;
      this.error = '';

      const message: ProfileMessage = {
        recipientId: Number(this.messageForm.value.recipientId),
        text: this.messageForm.value.text,
        resource: this.messageForm.value.resource || ''
      };

      console.log('Sending message:', message);

      this.profileService.sendMessage(message).subscribe({
        next: () => {
          this.messageForm.reset();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error sending message:', err);
          this.error = 'Failed to send message';
          this.loading = false;
        }
      });
    }
  }
}