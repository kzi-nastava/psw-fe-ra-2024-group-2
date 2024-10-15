import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourReviewComponent } from './tour-review/tour-review.component';
import { ToursComponent } from './tours/tours.component';



@NgModule({
  declarations: [
    TourReviewComponent,
    ToursComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    TourReviewComponent,
    ToursComponent
  ]
})
export class TourExecutionModule { }
