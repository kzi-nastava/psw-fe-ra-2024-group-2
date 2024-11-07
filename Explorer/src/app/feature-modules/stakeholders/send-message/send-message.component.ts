import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileMessage } from '../model/profile-message.model';

@Component({
  selector: 'xp-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent {
  profileMessage = {
    recipientId: 0,
    text: '',
    resource: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  sendMessage() {
    const url = 'http://your-backend-api-url/api/profile/messaging/new/message';

    this.http.post(url, this.profileMessage).subscribe(
      () => {
        alert('Message sent successfully!');
        this.router.navigate(['/']); // navigacija nazad ili ka nekoj drugoj stranici
      },
      (error) => {
        console.error('Error sending message:', error);
        alert('Failed to send message.');
      }
    );
  }
}
