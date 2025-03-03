import { Component, Input, OnInit } from '@angular/core';
import { Tour } from '../../model/tour.model';
import { BasketService } from '../basket.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  tours: Tour[] = []; // List of selected tours
  private basketSubscription: Subscription;

  constructor(
      private basketService: BasketService,
      private authService: AuthService
    ){}

  ngOnInit(): void {
    this.basketSubscription = this.basketService.getBasketObservable().subscribe(
      (basket) => {
        this.tours = basket.tours || [];  // Update the tours list when the basket changes
      }
    );
    //this.loadTours();  
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.basketSubscription) {
      this.basketSubscription.unsubscribe();
    }
  }

  loadTours(){
    this.tours = this.basketService.getAllTours();
  }

  getTotalPrice(): number {
    return this.tours.reduce((total, tour) => total + tour.price, 0);
  }

  getBonusPoints(): number {
    return this.authService.getBonusPoints();
  }

  buyTours() {
    alert("Purchase successful!");
    //const tourIds = this.tours.map(tour => tour.id);
    var x = this.basketService.buyTours();
    x.subscribe(
      (response) => {
          console.log('Success:', response);  // This will print the response data from the server
      },
      (error) => {
          console.error('Error:', error);  // This will print any error if the request fails
      }
  );
    //this.basketService.clearBaske

    this.tours = []; // Clear basket after purchase
  }

  resetBasket() {
    // Implement navigation or close the basket view
    this.basketService.refreshBasket();
    //this.loadTours();
  }
}
