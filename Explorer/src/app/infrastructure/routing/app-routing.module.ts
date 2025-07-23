import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountManagementComponent } from 'src/app/feature-modules/administration/account-management/account-management.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { FaqComponent } from 'src/app/feature-modules/administration/faq/faq.component';
import { RatingApplicationComponent } from 'src/app/feature-modules/administration/rating-application/rating-application.component';
import { TouristEquipmentComponent } from 'src/app/feature-modules/administration/tourist-equipment/tourist-equipment.component';
import { ToursitClubComponent } from 'src/app/feature-modules/administration/toursit-club/toursit-club.component';
import { CommentComponent } from 'src/app/feature-modules/blog/comment/comment.component';
import { EncounterComponent } from 'src/app/feature-modules/encounters/encounter/encounter.component';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { CreateTourBundleComponent } from 'src/app/feature-modules/marketplace/bundles/create-tour-bundle.component';
import { ManageTouristFundsComponent } from 'src/app/feature-modules/marketplace/manage-tourist-funds/manage-tourist-funds.component';
import { NewSaleComponent } from 'src/app/feature-modules/marketplace/new-sale/new-sale.component';
import { SaleComponent } from 'src/app/feature-modules/marketplace/sale/sale.component';
import { ShowAllBundlesComponent } from 'src/app/feature-modules/marketplace/show-all-bundles/show-all-bundles.component';
import { MyBundlesComponent } from 'src/app/feature-modules/marketplace/show-my-bundles/my-bundles.component';
import { ShowWalletComponent } from 'src/app/feature-modules/marketplace/show-wallet/show-wallet.component';
import { DiariesComponent } from 'src/app/feature-modules/stakeholders/personal-diaries/personal-diaries.component';
import { PositionSimulatorComponent } from 'src/app/feature-modules/stakeholders/position-simulator/position-simulator.component';
import { ProfileComponent } from 'src/app/feature-modules/stakeholders/profile/profile.component';
import { RateAppFormComponent } from 'src/app/feature-modules/stakeholders/rate-app-form/rate-app-form.component';
import { SendMessageComponent } from 'src/app/feature-modules/stakeholders/send-message/send-message.component';
import { AddTourCheckpointsComponent } from 'src/app/feature-modules/tour-authoring/add-tour-checkpoints/add-tour-checkpoints.component';
import { AddNewTourComponent } from 'src/app/feature-modules/tour-authoring/addNewTour/addNewTour.component';
import { ClubComponent } from 'src/app/feature-modules/tour-authoring/club/club.component';
import { EditTourComponent } from 'src/app/feature-modules/tour-authoring/edittour/edittour.component';
import { EventAnalyticsComponent } from 'src/app/feature-modules/tour-authoring/event-analytics/event-analytics.component';
import { EventDetailsComponent } from 'src/app/feature-modules/tour-authoring/event-details/event-details.component';
import { EventComponent } from 'src/app/feature-modules/tour-authoring/event/event.component';
import { MyToursComponent } from 'src/app/feature-modules/tour-authoring/mytours/mytours.component';
import { ObjectComponent } from 'src/app/feature-modules/tour-authoring/object/object.component';
import { ObjectsManagementComponent } from 'src/app/feature-modules/tour-authoring/objects-management/objects-management.component';
import { PopularEventsComponent } from 'src/app/feature-modules/tour-authoring/popular-events/popular-events.component';
import { TourPreferenceComponent } from 'src/app/feature-modules/tour-authoring/tour-preference/tour-preference.component';
import { PurchasedToursComponent } from 'src/app/feature-modules/tour-execution/purchased-tours/purchased-tours.component';
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
import { EncounterExecutionComponent } from 'src/app/feature-modules/encounters/encounter-execution/encounter-execution.component';
import { CreateSouvenirsComponent } from 'src/app/feature-modules/marketplace/souvenirs/create-souvenirs.component';
import { ShowMySouvenirsAuthorComponent } from 'src/app/feature-modules/marketplace/show-my-souvenirs-author/show-my-souvenirs.author.component';
import { SouvenirListComponent } from 'src/app/feature-modules/marketplace/show-all-souvenirs/souvenir-list.component';
import { SouvenirsComponent } from 'src/app/feature-modules/marketplace/show-bought-souvenirs/souvenirs.component';
import { WheelOfFortuneComponent } from 'src/app/feature-modules/layout/wheel-of-fortune/wheel-of-fortune.component';
import { TourDetailsComponent } from 'src/app/feature-modules/tour-execution/tour-details/tour-details.component';
import { EventsCalendarComponent } from 'src/app/feature-modules/tour-authoring/events-calendar/events-calendar.component';
import {EventFormComponent} from 'src/app/feature-modules/tour-authoring/event-form/event-form.component';
import { ProfileMessagingChatComponent } from 'src/app/feature-modules/stakeholders/profile-messaging-chat/profile-messaging-chat.component';
import { ProfileMessagingMainComponent } from 'src/app/feature-modules/stakeholders/profile-messaging-main/profile-messaging-main.component';

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
  {path: 'shopping-cart/purchasedSouvenirs', component: SouvenirsComponent, canActivate: [AuthGuard]},
  {path: 'tourPreference', component: TourPreferenceComponent, canActivate: [AuthGuard]},
  {path: 'faq', component: FaqComponent, canActivate: [AuthGuard]},
  {path: 'events', component: EventComponent, canActivate: [AuthGuard]},
  {path: 'tour/:id/checkpoints', component: AddTourCheckpointsComponent, canActivate: [AuthGuard]},
  {path: 'eventAnalytics', component: EventAnalyticsComponent, canActivate: [AuthGuard]},  
  {path: 'popularEvents', component: PopularEventsComponent, canActivate: [AuthGuard]},
  {path: 'encounters', component: EncounterComponent, canActivate: [AuthGuard]},
  {path: 'event/:id', component: EventDetailsComponent, canActivate: [AuthGuard]},
  {path: 'diaries/:userId', component: DiariesComponent,canActivate: [AuthGuard]},
  {path: 'tour/bundle/create', component: CreateTourBundleComponent, canActivate: [AuthGuard]},
  {path: 'bundles', component: ShowAllBundlesComponent, canActivate: [AuthGuard]},
  {path: 'mybundles', component: MyBundlesComponent, canActivate: [AuthGuard]},
  {path: 'mywallet', component: ShowWalletComponent, canActivate: [AuthGuard]},
  {path: 'manageTouristFunds', component: ManageTouristFundsComponent, canActivate: [AuthGuard]},
  {path: 'sale', component: SaleComponent, canActivate: [AuthGuard]},
  {path: 'newSale', component: NewSaleComponent, canActivate: [AuthGuard]},
  {path: 'manageTouristFunds', component: ManageTouristFundsComponent, canActivate: [AuthGuard]},
  {path: 'encounter-execution', component: EncounterExecutionComponent, canActivate: [AuthGuard]},
  {path: 'souvenirs/create', component: CreateSouvenirsComponent, canActivate: [AuthGuard]},
  {path: 'souvenirs', component: ShowMySouvenirsAuthorComponent, canActivate: [AuthGuard]},
  {path: 'all-souvenirs', component: SouvenirListComponent, canActivate: [AuthGuard]},
  {path: 'wheel-of-fortune', component: WheelOfFortuneComponent, canActivate: [AuthGuard]},
  {path: 'tour-details/:tourId', component: TourDetailsComponent, canActivate: [AuthGuard]},
  {path: 'eventsCalendar', component: EventsCalendarComponent, canActivate: [AuthGuard]},
  {path: 'addEvent', component: EventFormComponent, canActivate: [AuthGuard]},
  {path: 'profileMessaging/chat/:userId', component: ProfileMessagingMainComponent },
  {path: 'profileMessaging', component: ProfileMessagingMainComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }