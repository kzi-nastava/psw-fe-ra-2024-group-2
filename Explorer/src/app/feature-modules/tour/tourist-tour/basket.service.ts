import { Injectable } from "@angular/core";
import { Basket } from "../model/basket.model";
import { BehaviorSubject, Observable } from "rxjs";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { Tour } from "../model/tour.model";
import { environment } from "src/env/environment";
import { HttpClient } from "@angular/common/http";
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
  export class BasketService {
    private basket: Basket = { touristId: 0, tours: [] };
    private basket$ = new BehaviorSubject<Basket>(this.basket);
  
    constructor(private authService: AuthService, private http: HttpClient,) {
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

    buyTours(): Observable<any> {
        console.log('Buying tours', this.basket.tours);

        console.log(`${environment.apiHost}tour/buyTours`);
        
        if(this.basket.tours != undefined){
            const tourIds = this.basket.tours.map(tour => tour.id);
            console.log("tours found");
            this.refreshBasket();
            return this.http.post<any>(environment.apiHost + 'tour/buyTours/', tourIds);
        }   

        console.log("tours not found");
        
        return of({ message: 'Basket is empty, no tours to buy.' });
    }
      
  
    refreshBasket() {
      this.basket.tours = [];  // Reset the basket after purchase
      this.basket$.next(this.basket);  // Notify components that the basket is now empty
    }
  
    getBasketObservable() {
      return this.basket$.asObservable();  // Return observable for components to subscribe to
    }
  }
  