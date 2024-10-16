import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourReviewComponent } from './tour-review/tour-review.component';
import { ToursComponent } from './tours/tours.component';
import { TourReviewFormComponent } from './tour-review-form/tour-review-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TourReviewComponent,
    ToursComponent,
    TourReviewFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports:[
    TourReviewComponent,
    ToursComponent
  ]
})
export class TourExecutionModule { }
