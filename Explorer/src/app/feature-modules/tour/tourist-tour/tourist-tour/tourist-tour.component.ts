import { Component, OnInit } from '@angular/core';
import { TourService } from '../../tour.service';
import { Tour } from '../../model/tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { BasketService } from '../basket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'xp-tourist-tour',
  templateUrl: './tourist-tour.component.html',
  styleUrls: ['./tourist-tour.component.css']
})
export class TouristTourComponent implements OnInit {
  tours: (Tour & { isInBasket: boolean })[] = [];
  x: number;
  tourDetails: boolean = false;
  selectedTourId: number | null;
  showBasket: boolean = false;
  private basketSubscription: Subscription;

  ngOnInit(): void {
    this.getAllTours();  
    // Subscribe to basket updates to track changes in the basket
    this.basketSubscription = this.basketService.getBasketObservable().subscribe((basket) => {
      this.updateToursInBasket(basket.tours || []);
    });

    //this.sendTestEmail();
  }

  constructor(
    private service: TourService,
    private basketService: BasketService,
  ){

  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.basketSubscription) {
      this.basketSubscription.unsubscribe();
    }
  }

  sendTestEmail(): void{
    this.service.sendTestEmail().subscribe(
      (response) => {
        console.log('Test email sent successfully:', response);
      },
      (error) => {
        console.error('Error sending test email:', error);
      }
    );    
  }

  getAllTours(): void {
      this.service.getAllTours().subscribe({
        next: (result: any) => {
          console.log("Tours result: ", result);  // This will print the full result object
          this.tours = result.value;
          //console.log("Tours array: ", JSON.stringify(result.value, null, 2));
          console.log("Tours array: ", JSON.stringify(this.tours, null, 2));
          //console.log("Tours array: ", JSON.stringify(this.tours, null, 2));          
        },
        error: () => {  
        }
      })
  }

  addToBasket(tour: Tour & { isInBasket: boolean }): void {
    // Check if the tour is already in the basket to avoid duplication
    if (!tour.isInBasket) {
      tour.isInBasket = true; // Mark as added to the basket
      this.basketService.addTour(tour);
      this.showBasketFunction();
    }
  }

  
  removeFromBasket(tour: Tour & { isInBasket: boolean }): void {
    // Check if the tour is already in the basket to avoid duplication
    if (tour.isInBasket) {
      tour.isInBasket = false; // Mark as added to the basket
      this.basketService.removeTour(tour);
      //this.hideBasket();
    }
  }

  seeTours(): void{
    this.selectedTourId = null;
    this.tourDetails = false;
  }

  toggleBasket() {
    this.showBasket = !this.showBasket;
  }

  hideBasket() {
    this.showBasket = false;
  }

  showBasketFunction() {
    this.showBasket = true;
  }

  seeTourDetails(tour: Tour): void{
    if(tour.id != undefined){
      this.selectedTourId = tour.id;
      this.tourDetails = true;
    }        
  }

  private updateToursInBasket(basketTours: Tour[]): void {
    // Set isInBasket flag for each tour
    this.tours.forEach(tour => {
      tour.isInBasket = basketTours.some(basketTour => basketTour.id === tour.id);
    });
  }

}
