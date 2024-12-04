import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourAuthoringService } from '../tour-authoring.service';
import { EventModel } from '../model/event.model';
import { Tour } from '../model/tour.model';
import { PagedResult } from '../shared/model/tour.module';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../../marketplace/services/shopping-cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShoppingCartComponent } from '../../marketplace/shopping-cart/shopping-cart.component';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';

@Component({
  selector: 'xp-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent {
  eventId: number;
  tours: Tour[] = []
  @ViewChild(ShoppingCartComponent) shoppingCart!: ShoppingCartComponent;
  constructor(private route: ActivatedRoute,private service: TourAuthoringService,private router: Router,private snackBar: MatSnackBar,
    private cartService: ShoppingCartService,private exeService: TourExecutionService) {}

  ngOnInit(): void {
    // Get the event id from the route parameters
    this.route.paramMap.subscribe(params => {
      this.eventId = +params.get('id')!;
    });
    this.service.getEventDetails(this.eventId).subscribe({
      next: (result: PagedResult<Tour>) =>{
        this.tours = result.results
      },
      error: (err:any) => {
        console.log(err)
      }
    });
  }
  showReviews(tourId: number): void {
    this.router.navigate(['/reviews', tourId]);
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
addToCart(tourId: number): void {
    // Provera da li je stavka već u korpi
    this.cartService.isItemInCart(tourId).subscribe(isInCart => {
      if (isInCart) {
        // Ako je stavka već u korpi, prikazujemo poruku i izlazimo iz metode
        this.snackBar.open('This item is already in your cart!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        return;
      }
  
      // Ako stavka nije u korpi, dodajemo je
      this.exeService.addToCart(tourId).subscribe({
        next: () => {
          console.log('Successfully added to cart');
          this.snackBar.open('Successfully added to cart!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
  
          // Provera da li je shopping cart otvoren pre poziva toggleCart
          if (this.shoppingCart) {
            this.shoppingCart.loadCartItems(); // Osvežavamo stavke u korpi
            
            // Ako korpa nije otvorena, pozivamo toggleCart da je otvorimo
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
    });
  }
}
