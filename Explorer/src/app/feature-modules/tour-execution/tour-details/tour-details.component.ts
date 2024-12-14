import { Component, ViewChild } from '@angular/core';
import { Tour } from '../model/tour-model';
import { ShoppingCartComponent } from '../../marketplace/shopping-cart/shopping-cart.component';
import { TourExecutionService } from '../tour-execution.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShoppingCartService } from '../../marketplace/services/shopping-cart.service';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'xp-tour-details',
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.css']
})
export class TourDetailsComponent {
  tour: Tour;
  tourId!: number;  
  checkpoints: Checkpoint [] = []
  @ViewChild(ShoppingCartComponent) shoppingCart!: ShoppingCartComponent;

  constructor(
    private service: TourExecutionService, 
    private router: Router, 
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private cartService: ShoppingCartService // Uključujemo ShoppingCartService za proveru korpe
  ) {} 

  ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
            this.tourId = Number(params.get('tourId'));

      if (this.tourId) {
        this.fetchTourDetails();
      }
    });
  }

  fetchTourDetails(): void {
    // Fetch the tour details
    this.service.getTourById(this.tourId).subscribe({
      next: (result: Tour) => {
        this.tour = result;
        if (this.tour.checkpoints?.length) {
          this.fetchCheckpoints(this.tour.checkpoints);
        }
      },
      error: (err) => {
        console.error('Error fetching tour:', err);
        this.snackBar.open('Failed to load tour details', 'Close', { duration: 3000 });
      }
    });
  }

  fetchCheckpoints(checkpointIds: number[]): void {
    this.service.getTourCheckpoints(checkpointIds).subscribe({
      next: (pagedResult) => {
        this.checkpoints = pagedResult.results; 
        console.log('Loaded checkpoints:', this.checkpoints);
      },
      error: (err) => {
        console.error('Error fetching checkpoints:', err);
        this.snackBar.open('Failed to load checkpoints', 'Close', { duration: 3000 });
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

  getTagLabel(tag: number): string {
    switch (tag) {
      case 0:
        return 'Adventure';
      case 1:
        return 'Relaxation';
      case 2:
        return 'Historical';
      case 3:
        return 'Cultural';
      case 4:
        return 'Nature';
      default:
        return 'Unknown';
    }
  }

  addToCart(tourId: number): void {
    this.cartService.isItemInCart(tourId).subscribe(isInCart => {
      if (isInCart) {
        this.snackBar.open('This item is already in your carrrrt!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        return;
      }
  
      // Check if the tour is already purchased
      this.service.getPurchasedTours().subscribe({
        next: (purchasedTours: Tour[]) => {
          const purchasedTourIds = purchasedTours.map(tour => tour.id); // Extract IDs
  
          if (purchasedTourIds.includes(tourId)) {
            this.snackBar.open('This item is already purchased!', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            return;
          }
  
          // Proceed to add the item to the cart
          this.service.addToCart(tourId).subscribe({
            next: () => {
              console.log('Successfully added to cart');
              this.snackBar.open('Successfully added to cart!', 'Close', {
                duration: 3000,
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
  
              if (this.shoppingCart) {
                this.shoppingCart.loadCartItems();
  
                if (!this.shoppingCart.isOpen) {
                  this.shoppingCart.toggleCart();
                }
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
        },
        error: (error: any) => {
          console.error('Error fetching purchased tours:', error);
        }
      });
    });
  }

  goToAllTours() {
    this.router.navigate(['/alltours']);
  }
}
