import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { TourExecutionService } from '../tour-execution.service';
import { PagedResult } from '../../tour-authoring/shared/model/tour.module';
import { Tour } from '../model/tour-model';

@Component({
  selector: 'xp-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss']
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

  getDifficultyLabel(difficulty: number): string {
    switch (difficulty) {
      case 0:
        return 'Easy';
      case 1:
        return 'Moderate';
      case 2:
        return 'Difficult';
      default:
        return 'Unknown';
    }
  }
  
  getStatusLabel(status: number): string {
    switch (status) {
      case 0:
        return 'Draft';
      case 1:
        return 'Published';
      case 2:
        return 'Archived';
      default:
        return 'Unknown';
    }
  }
}
