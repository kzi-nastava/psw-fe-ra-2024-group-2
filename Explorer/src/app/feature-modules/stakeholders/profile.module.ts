import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { ProfileFormComponent } from "./profile-form/profile-form.component";
import { ProfileComponent } from "./profile/profile.component";
import { RateAppFormComponent } from './rate-app-form/rate-app-form.component';

@NgModule({
    declarations: [
        ProfileComponent,
        ProfileFormComponent,
        RateAppFormComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule
    ],
    exports: [
        ProfileComponent,
        ProfileFormComponent,
        RateAppFormComponent

    ]
})
export class ProfileModule { }
