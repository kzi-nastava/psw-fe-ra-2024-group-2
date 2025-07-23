import { Component, ElementRef, OnInit, ViewChild, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { ProfileMessage } from '../model/profile-message.model';
import { Profile } from '../model/profile.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'xp-profile-messaging-chat',
  templateUrl: './profile-messaging-chat.component.html',
  styleUrls: ['./profile-messaging-chat.component.css']
})
export class ProfileMessagingChatComponent implements OnInit, OnChanges {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  @Input() recipientId!: number;

  currentUser!: Profile;
  recipient!: Profile;
  messages: ProfileMessage[] = [];
  newMessage: string = '';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe(user => {
      this.currentUser = user;

      if (this.recipientId) {
        this.loadRecipientAndMessages();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recipientId'] && this.currentUser) {
      this.loadRecipientAndMessages();
    }
  }

  loadRecipientAndMessages(): void {
    this.profileService.getById(this.recipientId).subscribe(recipient => {
      this.recipient = recipient;
    });

    this.profileService.getConversation(this.recipientId).subscribe(messages => {
      this.messages = messages;
      this.scrollToBottom();
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const msg: ProfileMessage = {
        recipientId: this.recipientId,
        text: this.newMessage,
        resource: ''
      };

      this.profileService.sendMessage(msg).subscribe(() => {
        this.messages.push({
          ...msg,
          senderId: this.currentUser.id,
          sentAt: new Date()
        } as any);
        this.newMessage = '';
        this.scrollToBottom();
      });
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }, 0);
  }

ngAfterViewInit() {
  setTimeout(() => {
    console.log('Chat container:', document.querySelector('.chat-container'));
    console.log('Input container:', document.querySelector('.input-container'));
  }, 1000);
}
}
