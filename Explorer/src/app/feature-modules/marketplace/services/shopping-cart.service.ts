import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private orderItemsCache: any[] = []; // Cache za stavke kako bismo izbegli više zahteva

  constructor(private http: HttpClient) {}

  // Metoda za dohvaćanje stavki iz korpe sa keširanjem
  getOrderItems(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiHost}tourist/shopping-cart/items`).pipe(
      tap((items: any[]) => {
        this.orderItemsCache = items; // Keširamo stavke
        console.log('Dohvaćene stavke:', items);
      })
    );
  }

  // Metoda za proveru da li stavka postoji u korpi
  isItemInCart(tourId: number): Observable<boolean> {
    // Ako je keširan rezultat, proveravamo lokalno
    if (this.orderItemsCache.length > 0) {
      const exists = this.orderItemsCache.some(item => item.tourId === tourId);
      return of(exists);
    }

    // Ako nema keša, prvo dohvatimo stavke pa proverimo
    return this.getOrderItems().pipe(
      map((items: any[]) => items.some(item => item.id === tourId))
    );
  }

  getTotalPrice(): Observable<number> {
    return this.getOrderItems().pipe(
      map((items: any[]) => {
        const totalPrice = items.reduce((sum: number, item: any) => sum + item.price, 0);
        console.log('Izračunata ukupna cijena:', totalPrice);
        return totalPrice;
      })
    );
  }

  removeItem(tourId: number): Observable<any> {
    console.log('Uklanjanje stavke s tourId:', tourId);
    return this.http.delete(`${environment.apiHost}tourist/shopping-cart/remove/${tourId}`).pipe(
      tap(() => {
        // Ažuriramo keš tako što uklonimo stavku
        this.orderItemsCache = this.orderItemsCache.filter(item => item.id !== tourId);
      })
    );
  }

  checkout(): Observable<any> {
    console.log('Započinje checkout');
    return this.http.get(`${environment.apiHost}tourist/shopping-cart/checkout`).pipe(
      tap(() => {
        // Očistimo keš nakon checkout-a
        this.orderItemsCache = [];
      })
    );
  }
}
