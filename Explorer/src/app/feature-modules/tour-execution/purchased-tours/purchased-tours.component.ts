import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TourExecutionService } from '../tour-execution.service';
import { Tour } from '../model/tour-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'xp-purchased-tours',
  templateUrl: './purchased-tours.component.html',
  styleUrls: ['./purchased-tours.component.css']
})
export class PurchasedToursComponent implements OnInit {
  tours: Tour[] = [];

  constructor(
    private service: TourExecutionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.service.getPurchasedTours().subscribe({
      next: (tours: Tour[]) => {
        console.log('Received purchased tours:', tours);
        this.tours = tours;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching purchased tours:', error);
        this.snackBar.open('Error fetching purchased tours', 'Close', { duration: 3000 });
      }
    });
  }


  showReviews(tourId: number): void {
    this.router.navigate(['/reviews', tourId]); // Navigates to /reviews/:tourId
  }

  // Method to navigate to the review form for a specific tour
  goToReviewForm(tourId: number): void {
    this.router.navigate(['/reviewform', tourId]); // Pass tourId as a route parameter
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
