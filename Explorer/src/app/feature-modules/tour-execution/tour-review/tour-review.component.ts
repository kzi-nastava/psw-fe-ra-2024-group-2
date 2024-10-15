import { Component, OnInit } from '@angular/core';
import { TourReview } from '../model/tour-review.model';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResult } from '../../tour-authoring/shared/model/tour.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xp-tour-review',
  templateUrl: './tour-review.component.html',
  styleUrls: ['./tour-review.component.css']
})
export class TourReviewComponent implements OnInit{
   
  reviews: TourReview[] = []
  tourId!: number;  

  constructor(private service: TourExecutionService,private route: ActivatedRoute){}
  
  ngOnInit(): void {
    // Fetch tourId from the route parameters
    this.route.paramMap.subscribe(params => {
      this.tourId = Number(params.get('tourId'));
      
      if (this.tourId) {
        this.service.getReviews(this.tourId).subscribe({
          next: (result: PagedResult<TourReview>) => {
            this.reviews = result.results;
          },
          error: (err) => {
            console.error('Error fetching reviews:', err);
          }
        });
      }
    });
  }


}
