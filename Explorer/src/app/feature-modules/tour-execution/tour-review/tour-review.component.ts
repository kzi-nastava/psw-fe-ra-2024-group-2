import { Component } from '@angular/core';
import { TourReview } from '../model/tour-review.model';

@Component({
  selector: 'xp-tour-review',
  templateUrl: './tour-review.component.html',
  styleUrls: ['./tour-review.component.css']
})
export class TourReviewComponent {
    reviews: TourReview[]
}
