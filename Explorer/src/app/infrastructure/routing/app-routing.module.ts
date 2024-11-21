import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountManagementComponent } from 'src/app/feature-modules/administration/account-management/account-management.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { RatingApplicationComponent } from 'src/app/feature-modules/administration/rating-application/rating-application.component';
import { TouristEquipmentComponent } from 'src/app/feature-modules/administration/tourist-equipment/tourist-equipment.component';
import { ToursitClubComponent } from 'src/app/feature-modules/administration/toursit-club/toursit-club.component';
import { CommentComponent } from 'src/app/feature-modules/blog/comment/comment.component';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { PositionSimulatorComponent } from 'src/app/feature-modules/stakeholders/position-simulator/position-simulator.component';
import { ProfileComponent } from 'src/app/feature-modules/stakeholders/profile/profile.component';
import { RateAppFormComponent } from 'src/app/feature-modules/stakeholders/rate-app-form/rate-app-form.component';
import { AddNewTourComponent } from 'src/app/feature-modules/tour-authoring/addNewTour/addNewTour.component';
import { ClubComponent } from 'src/app/feature-modules/tour-authoring/club/club.component';
import { EditTourComponent } from 'src/app/feature-modules/tour-authoring/edittour/edittour.component';
import { MyToursComponent } from 'src/app/feature-modules/tour-authoring/mytours/mytours.component';
import { ObjectComponent } from 'src/app/feature-modules/tour-authoring/object/object.component';
import { ObjectsManagementComponent } from 'src/app/feature-modules/tour-authoring/objects-management/objects-management.component';
import { SearchToursComponent } from 'src/app/feature-modules/tour-execution/search-tours/search-tours.component';
import { TourIssueManagementComponent } from 'src/app/feature-modules/tour-execution/tour-issue-management/tour-issue-management.component';
import { TourIssueReportComponent } from 'src/app/feature-modules/tour-execution/tour-issue-report/tour-issue-report.component';
import { TourReportingComponent } from 'src/app/feature-modules/tour-execution/tour-reporting/tour-reporting.component';
import { TourReviewFormComponent } from 'src/app/feature-modules/tour-execution/tour-review-form/tour-review-form.component';
import { TourReviewComponent } from 'src/app/feature-modules/tour-execution/tour-review/tour-review.component';
import { ToursComponent } from 'src/app/feature-modules/tour-execution/tours/tours.component';
import { BlogComponentComponent } from '../../feature-modules/blog/blog-component/blog-component.component';
import { CreateBlogComponent } from '../../feature-modules/blog/create-blog/create-blog.component';
import { AuthGuard } from '../auth/auth.guard';
import { LoginComponent } from '../auth/login/login.component';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { SendMessageComponent } from 'src/app/feature-modules/stakeholders/send-message/send-message.component';
import { PurchasedToursComponent } from 'src/app/feature-modules/tour-execution/purchased-tours/purchased-tours.component';
import { TourPreferenceComponent } from 'src/app/feature-modules/tour-authoring/tour-preference/tour-preference.component';
import { FaqComponent } from 'src/app/feature-modules/administration/faq/faq.component';
import { EventFormComponent } from 'src/app/feature-modules/tour-authoring/event-form/event-form.component';
import { EventComponent } from 'src/app/feature-modules/tour-authoring/event/event.component';
import { AddTourCheckpointsComponent } from 'src/app/feature-modules/tour-authoring/add-tour-checkpoints/add-tour-checkpoints.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard],},
  {path: 'club', component: ClubComponent, canActivate: [AuthGuard],},
  {path: 'myclub', component: ToursitClubComponent, canActivate: [AuthGuard],},
  {path: 'blog', component: BlogComponentComponent, canActivate: [AuthGuard],},
  {path: 'mytours', component: MyToursComponent, canActivate: [AuthGuard],},
  {path: 'edittours', component: EditTourComponent, canActivate: [AuthGuard]},
  //{path: 'comment', component: CommentComponent, canActivate: [AuthGuard] },
  {path: 'edittours', component: EditTourComponent, canActivate: [AuthGuard]},
  {path: 'account', component: AccountManagementComponent, canActivate: [AuthGuard],},
  {path: 'reviews/:tourId', component: TourReviewComponent, canActivate: [AuthGuard] },
  {path: 'reviewform/:tourId', component: TourReviewFormComponent, canActivate: [AuthGuard] },
  {path: 'tourReporting', component: TourReportingComponent, canActivate: [AuthGuard]},
  {path: 'tourIssueReport', component: TourIssueReportComponent, canActivate: [AuthGuard]},
  {path: 'alltours', component: ToursComponent, canActivate: [AuthGuard]},
  {path: 'objects', component: ObjectComponent, canActivate: [AuthGuard]},
  {path: 'tourReporting', component: TourReportingComponent, canActivate: [AuthGuard]},
  {path: 'tourIssueReport', component: TourIssueReportComponent, canActivate: [AuthGuard]},
  {path: 'objectsTable', component:ObjectsManagementComponent, canActivate: [AuthGuard]},
  {path: 'position-simulator', component:PositionSimulatorComponent, canActivate: [AuthGuard]},
  {path: 'rateApp', component:RateAppFormComponent, canActivate: [AuthGuard]},
  {path: 'ratingsApplications', component:RatingApplicationComponent, canActivate: [AuthGuard]},
  {path: 'touristEquipment', component:TouristEquipmentComponent, canActivate: [AuthGuard]},
  {path: 'addNewTour', component: AddNewTourComponent, canActivate: [AuthGuard]},
  {path: 'blog/:id', component: CommentComponent },
  {path: 'alltours/search', component: SearchToursComponent, canActivate: [AuthGuard]},
  {path: 'alltours/search', component: SearchToursComponent, canActivate: [AuthGuard]},
  {path: 'addNewTour', component: AddNewTourComponent, canActivate: [AuthGuard]},
  {path: 'tourIssueManagement/:tourIssueReportId', component: TourIssueManagementComponent, canActivate: [AuthGuard]},
  {path: 'create-blog', component: CreateBlogComponent, canActivate: [AuthGuard]},
  {path: 'profileMessaging', component: SendMessageComponent, canActivate: [AuthGuard]},
  {path: 'shopping-cart/purchasedTours', component: PurchasedToursComponent, canActivate: [AuthGuard]},
  {path: 'tourPreference', component: TourPreferenceComponent, canActivate: [AuthGuard]},
  {path: 'faq', component: FaqComponent, canActivate: [AuthGuard]},
  {path: 'events', component: EventComponent, canActivate: [AuthGuard]},
  {path: 'tour/:id/checkpoints', component: AddTourCheckpointsComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }