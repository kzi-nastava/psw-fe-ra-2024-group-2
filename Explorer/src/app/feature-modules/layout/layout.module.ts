import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { TourReviewsComponent } from './tour-reviews/tour-reviews.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    TourReviewsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent,
    TourReviewsComponent
  ]
})
export class LayoutModule { }
