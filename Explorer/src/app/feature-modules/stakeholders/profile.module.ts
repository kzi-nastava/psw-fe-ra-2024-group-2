import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms"; // Dodajte FormsModule
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { ProfileFormComponent } from "./profile-form/profile-form.component";
import { ProfileComponent } from "./profile/profile.component";
import { RateAppFormComponent } from './rate-app-form/rate-app-form.component';
import { SendMessageComponent } from './send-message/send-message.component';

@NgModule({
    declarations: [
        ProfileComponent,
        ProfileFormComponent,
        RateAppFormComponent,
        SendMessageComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,          // Dodato FormsModule
        ReactiveFormsModule
    ],
    providers: [DatePipe],
    exports: [
        ProfileComponent,
        ProfileFormComponent,
        RateAppFormComponent
    ]
})
export class ProfileModule { }
