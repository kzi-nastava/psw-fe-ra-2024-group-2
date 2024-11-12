import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResult } from '../../tour-authoring/shared/model/tour.module';
import { Tour } from '../model/tour-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ShoppingCartComponent } from '../../marketplace/shopping-cart/shopping-cart.component';

@Component({
  selector: 'xp-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss']
})
export class ToursComponent implements OnInit {
  tours: Tour[] = [];
  @ViewChild(ShoppingCartComponent) shoppingCart!: ShoppingCartComponent;

  constructor(
    private service: TourExecutionService, 
    private router: Router, 
    private snackBar: MatSnackBar
  ) {} 
  
  ngOnInit(): void {
    this.service.getTours().subscribe({
      next: (result: PagedResult<Tour>) => {
        this.tours = this.tours.filter(tour => tour.status !== 2);
        this.tours = result.results;
      }
    });
  }

  showReviews(tourId: number): void {
    this.router.navigate(['/reviews', tourId]);
  }

  goToReviewForm(tourId: number): void {
    this.router.navigate(['/reviewform', tourId]);
  }

  gotoTourSearch() {
    this.router.navigate(['/alltours/search']);
  }
  
  startTour(tourId: number): void {
    console.log('Starting tour:', tourId);
    this.service.startTour(tourId).subscribe({
      next: (response) => {
        console.log('Tour started successfully!', response);
        this.router.navigate(['/position-simulator']);
      },
      error: (error) => {
        console.error('Failed to start the tour:', error);
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
        // Ovde dodajemo poziv za otvaranje cart komponente
        if (this.shoppingCart) {
          this.shoppingCart.toggleCart();
          this.shoppingCart.loadCartItems(); // Osvežavamo items u cart-u
        }
      },
      error: (error: any) => {
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