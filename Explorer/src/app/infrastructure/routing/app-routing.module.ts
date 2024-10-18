import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountManagementComponent } from 'src/app/feature-modules/administration/account-management/account-management.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { RatingApplicationComponent } from 'src/app/feature-modules/administration/rating-application/rating-application.component';
import { ToursitClubComponent } from 'src/app/feature-modules/administration/toursit-club/toursit-club.component';
import { CommentComponent } from 'src/app/feature-modules/blog/comment/comment.component';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { ProfileComponent } from 'src/app/feature-modules/stakeholders/profile/profile.component';
import { RateAppFormComponent } from 'src/app/feature-modules/stakeholders/rate-app-form/rate-app-form.component';
import { EditTourComponent } from 'src/app/feature-modules/tour-authoring/edittour/edittour.component';
import { CheckpointComponent } from 'src/app/feature-modules/tour-authoring/checkpoint/checkpoint.component';

import { MyToursComponent } from 'src/app/feature-modules/tour-authoring/mytours/mytours.component';
import { ObjectComponent } from 'src/app/feature-modules/tour-authoring/object/object.component';
import { TourIssueReportComponent } from 'src/app/feature-modules/tour-execution/tour-issue-report/tour-issue-report.component';
import { TourReportingComponent } from 'src/app/feature-modules/tour-execution/tour-reporting/tour-reporting.component';
import { AuthGuard } from '../auth/auth.guard';
import { LoginComponent } from '../auth/login/login.component';
import { RegistrationComponent } from '../auth/registration/registration.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard],},
  {path: 'mytours', component: MyToursComponent, canActivate: [AuthGuard],},
  {path: 'edittours', component: EditTourComponent, canActivate: [AuthGuard]},
  {path: 'checkpoints', component: CheckpointComponent, canActivate: [AuthGuard]},
  {path: 'comment', component: CommentComponent, canActivate: [AuthGuard] },
  {path: 'edittours', component: EditTourComponent, canActivate: [AuthGuard]},
  {path: 'account', component: AccountManagementComponent, canActivate: [AuthGuard],},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }