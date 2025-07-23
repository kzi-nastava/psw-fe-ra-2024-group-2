import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms"; // Dodajte FormsModule
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { ProfileFormComponent } from "./profile-form/profile-form.component";
import { ProfileComponent } from "./profile/profile.component";
import { RateAppFormComponent } from './rate-app-form/rate-app-form.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { DiariesComponent } from './personal-diaries/personal-diaries.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { ProfileMessagingChatComponent } from './profile-messaging-chat/profile-messaging-chat.component';
import { ProfileMessagingMainComponent } from './profile-messaging-main/profile-messaging-main.component';
import { ChatSidebarComponent } from './chat-sidebar/chat-sidebar.component';

@NgModule({
    declarations: [
        ProfileComponent,
        ProfileFormComponent,
        RateAppFormComponent,
        SendMessageComponent,
        DiariesComponent,
        ProfileMessagingChatComponent,
        ProfileMessagingMainComponent,
        ChatSidebarComponent
    ],
    imports: [
    CommonModule,
    MaterialModule,
    FormsModule, // Dodato FormsModule
    ReactiveFormsModule,
    MatProgressBarModule,
    MatCardModule,
    MatDividerModule
],
    providers: [DatePipe],
    exports: [
        ProfileComponent,
        ProfileFormComponent,
        RateAppFormComponent
    ]
})
export class ProfileModule { }
