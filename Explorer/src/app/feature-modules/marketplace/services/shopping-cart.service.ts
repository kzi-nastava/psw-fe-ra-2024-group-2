import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/env/environment';
import { Coupon } from '../../tour-authoring/model/coupon.model';
import { TouristBonus } from '../model/touristBonus.model';

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
      map((items: any[]) => { 
        return items.some(item => item.id === tourId); 
      })
    );
  }

  isSouvenirInCart(itemId: number) {
    if (this.orderItemsCache.length > 0) {
      const exists = this.orderItemsCache.some(item => item.souvenirId === itemId);
      return of(exists);
    }

    return this.getOrderItems().pipe(
      map((items: any[]) => { 
        return items.some(item => item.souvenirId == itemId) 
      })
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

    if (item.bundleId) {
      return this.http.delete(`${environment.apiHost}tourist/shopping-cart/remove-bundle/${item.bundleId}`).pipe(
        tap(() => {
          // Ažuriramo keš tako što uklonimo stavku
          this.orderItemsCache = this.orderItemsCache.filter(i => i.bundleId !== item.bundleId);
        }));
    } else if (item.tourId) {
      return this.http.delete(`${environment.apiHost}tourist/shopping-cart/remove/${item.tourId}`).pipe(
        tap(() => {
          // Ažuriramo keš tako što uklonimo stavku
          this.orderItemsCache = this.orderItemsCache.filter(i => i.tourId !== item.tourId);
        })
      );
    } else if (item.souvenirId) {
      return this.http.delete(`${environment.apiHost}tourist/shopping-cart/remove-souvenir/${item.souvenirId}`).pipe(
        tap(() => {
          // Ažuriramo keš tako što uklonimo stavku
          this.orderItemsCache = this.orderItemsCache.filter(i => i.souvenirId !== item.souvenirId);
        })
      );
    } else {
      console.error('Nepoznata stavka za brisanje:', item);
      return of(null);
    }
  }

  checkout(couponCode: string): Observable<any> {
    console.log('Započinje checkout');
    const params = { couponCode }; // Add couponCode to query parameters
    return this.http.get(`${environment.apiHost}tourist/shopping-cart/checkout`, { params }).pipe(
      tap(() => {
        // Očistimo keš nakon checkout-a
        this.orderItemsCache = [];
      })
    );
  }

  
  useTouristBonus(touristId: number, couponCode: string): Observable<TouristBonus>{
    return this.http.put<TouristBonus>(`https://localhost:44333/api/tourist/touristBonus/use/${touristId}/${couponCode}`, {});
  }

  buyBundle(id: number): Observable<any> {
    return this.http.post(`${environment.apiHost}tourist/shopping-cart/add-bundle/${id}`, {});
  }

  buySouvenir(id: number): Observable<any> {
    return this.http.post(`${environment.apiHost}tourist/shopping-cart/add-souvenir/${id}`, {});
  }

  applyCoupon(code: string): Observable<Coupon> {
    return this.http.post<Coupon>(`https://localhost:44333/api/tourist/coupon?code=${encodeURIComponent(code)}`, null);
  }

}
