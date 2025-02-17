import { Injectable } from "@angular/core";
import { Basket } from "../model/basket.model";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { Tour } from "../model/tour.model";

@Injectable({
    providedIn: 'root',
  })
  export class BasketService {
    private basket: Basket = { touristId: 0, tours: [] };
    private basket$ = new BehaviorSubject<Basket>(this.basket);
  
    constructor(private authService: AuthService) {
      this.initializeBasket();
    }
  
    private initializeBasket() {
      this.basket.touristId = this.authService.getUserId();
      this.basket.tours = [];
      this.basket$.next(this.basket);
    }
  
    addTour(tour: Tour) {
      if (!this.basket.tours) {
        this.basket.tours = [];
      }
      // Check if the tour is already in the basket to avoid duplication
      if (!this.basket.tours.some(t => t.id === tour.id)) {
        this.basket.tours.push(tour);
        this.basket$.next(this.basket);  // Notify components about the change
      }
    }
  
    removeTour(tour: Tour) {
      this.basket.tours = this.basket.tours?.filter(t => t.id !== tour.id);
      this.basket$.next(this.basket);  // Notify components about the change
    }
  
    getAllTours(): Tour[] {
      return this.basket.tours || [];
    }
  
    buyTours() {
      // Simulate an API call to purchase the tours
      console.log('Buying tours', this.basket.tours);
      this.refreshBasket();  // Clear the basket after purchase
    }
  
    refreshBasket() {
      this.basket.tours = [];  // Reset the basket after purchase
      this.basket$.next(this.basket);  // Notify components that the basket is now empty
    }
  
    getBasketObservable() {
      return this.basket$.asObservable();  // Return observable for components to subscribe to
    }
  }
  