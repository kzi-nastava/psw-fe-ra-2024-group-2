import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { TourExecutionService } from '../tour-execution.service';
import { PagedResult } from '../../tour-authoring/shared/model/tour.module';
import { Tour } from '../model/tour-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'xp-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss']
})
export class ToursComponent implements OnInit {

  tours: Tour[] = [];

  constructor(private service: TourExecutionService, private router: Router, private snackBar: MatSnackBar) {} 
  
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

  gotoTourSearch() {
    this.router.navigate(['/alltours/search']); // Navigate to the search tours
  }
  
  startTour(tourId: number): void {
    console.log('Starting tour:', tourId);
    this.service.startTour(tourId).subscribe({
      next: (response) => {
        console.log('Tour started successfully!', response);
        this.router.navigate(['/position-simulator']); // Navigate on success
      },
      error: (error) => {
        console.error('Failed to start the tour:', error); // Handle error
        // Optionally, show a user-friendly message or retry logic
      }
    });
  }

  addToCart(tourId: number): void {
    this.service.addToCart(tourId).subscribe({
      next: () => {
        console.log('Successfully added to cart');
        this.snackBar.open('Successfully added to cart!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      },
      error: (error: any) => {  // eksplicitno definišemo tip error parametra
        console.error('Error adding to cart:', error);
        this.snackBar.open('Error adding to cart. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
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
