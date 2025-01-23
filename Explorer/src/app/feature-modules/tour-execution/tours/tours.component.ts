import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../../marketplace/services/shopping-cart.service';
import { ShoppingCartComponent } from '../../marketplace/shopping-cart/shopping-cart.component';
import { TourSale } from '../../tour-authoring/model/tourSale.model';
import { PagedResult } from '../../tour-authoring/shared/model/tour.module';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Tour } from '../model/tour-model';
import { TourExecutionService } from '../tour-execution.service';

@Component({
  selector: 'xp-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss']
})
export class ToursComponent implements OnInit {
  tours: Tour[] = [];
  tourSales: TourSale[] = [];
  @ViewChild(ShoppingCartComponent) shoppingCart!: ShoppingCartComponent;

  constructor(
    private service: TourExecutionService, 
    private router: Router, 
    private snackBar: MatSnackBar,
    private tourService : TourAuthoringService,
    private cartService: ShoppingCartService // Uključujemo ShoppingCartService za proveru korpe
  ) {} 
  
  ngOnInit(): void {
    this.service.getTours().subscribe({
      next: (result: PagedResult<Tour>) => {
        this.tours = result.results;
        this.tours = this.tours.filter(tour => tour.status === 1);
      }
    });
    this.loadTourSales();
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

   //Sale methods
   loadTourSales(): void {
    this.tourService.getAllSale().subscribe((sales) => {
      this.tourSales = sales;
      console.log(sales)
    });
  }

  isOnSale(tourId: number): boolean {
    const isOnSale = this.tourSales.some((sale) =>
      sale.tours.some((tour) =>
        tour.prices.some((price) => price.tourId === tourId)
      )
    );
    return isOnSale;
  }
  

  getSalePrice(tourId: number): number | null {
    for (const sale of this.tourSales) {
      for (const tour of sale.tours) {
        const price = tour.prices.find((p: { tourId: number; }) => p.tourId === tourId);
        if (price) {
          return price.newPrice;
        }
      }
    }
    return null;
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

  onViewDetails(tourId: number): void {
    this.router.navigate(['/tour-details', tourId]);
  }
}
