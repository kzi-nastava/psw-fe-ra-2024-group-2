import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { TourExecutionService } from '../tour-execution.service';
import { PagedResult } from '../../tour-authoring/shared/model/tour.module';
import { Tour } from '../model/tour-model';

@Component({
  selector: 'xp-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.css']
})
export class ToursComponent implements OnInit {

  tours: Tour[] = [];

  constructor(private service: TourExecutionService, private router: Router) {} 
  
  ngOnInit(): void {
    this.service.getTours().subscribe({
      next: (result: PagedResult<Tour>) => {
        this.tours = result.results;
      }
    });
  }

  // Method to navigate to the reviews page for a specific tour
  showReviews(tourId: number): void {
    this.router.navigate(['/reviews', tourId]); // Navigates to /reviews/:tourId
  }

  // Method to navigate to the review form for a specific tour
  goToReviewForm(tourId: number): void {
    this.router.navigate(['/reviewform', tourId]); // Pass tourId as a route parameter
  }
}
