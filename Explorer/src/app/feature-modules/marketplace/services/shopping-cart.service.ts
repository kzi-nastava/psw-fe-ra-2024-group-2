import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private orderItemsCache: any[] = []; // Cache za stavke kako bismo izbegli više zahteva

  constructor(private http: HttpClient) { }

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

  removeItem(item: any): Observable<any> {
    console.log('Brišemo stavku iz korpe:', item);

    if(item.bundleId) {
      return this.http.delete(`${environment.apiHost}tourist/shopping-cart/remove-bundle/${item.bundleId}`).pipe(
        tap(() => {
          // Ažuriramo keš tako što uklonimo stavku
          this.orderItemsCache = this.orderItemsCache.filter(i => i.bundleId !== item.bundleId);
        }));
    } else {
      return this.http.delete(`${environment.apiHost}tourist/shopping-cart/remove/${item.tourId}`).pipe(
        tap(() => {
          // Ažuriramo keš tako što uklonimo stavku
          this.orderItemsCache = this.orderItemsCache.filter(i => i.tourId !== item.tourId);
        })
      );
    }
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

  buyBundle(id: number): Observable<any> {
    return this.http.post(`${environment.apiHost}tourist/shopping-cart/add-bundle/${id}`, {});
  }
}
