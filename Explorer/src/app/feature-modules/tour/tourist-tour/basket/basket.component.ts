import { Component, Input, OnInit } from '@angular/core';
import { Tour } from '../../model/tour.model';
import { BasketService } from '../basket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'xp-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  tours: Tour[] = []; // List of selected tours
  private basketSubscription: Subscription;

  constructor(
      private service: BasketService,
    ){}

  ngOnInit(): void {
    this.basketSubscription = this.service.getBasketObservable().subscribe(
      (basket) => {
        this.tours = basket.tours || [];  // Update the tours list when the basket changes
      }
    );
    //this.loadTours();  
  }

  loadTours(){
    this.tours = this.service.getAllTours();
  }

  getTotalPrice(): number {
    return this.tours.reduce((total, tour) => total + tour.price, 0);
  }

  buyTours() {
    alert("Purchase successful!");
    this.tours = []; // Clear basket after purchase
  }

  resetBasket() {
    // Implement navigation or close the basket view
    this.service.refreshBasket();
    //this.loadTours();
  }
}
