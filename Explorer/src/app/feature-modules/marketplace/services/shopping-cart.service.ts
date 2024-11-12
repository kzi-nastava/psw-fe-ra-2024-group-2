import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  constructor(private http: HttpClient) { }

  getOrderItems(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiHost}tourist/shopping-cart/items`).pipe(
      tap((items: any[]) => {
        console.log('Dohvaćene stavke:', items);
      })
    );
  }

  getTotalPrice(): Observable<number> {
    // Prvo dohvatimo items pa onda izračunamo total
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
    return this.http.delete(`${environment.apiHost}tourist/shopping-cart/remove/${tourId}`);
  }

  checkout(): Observable<any> {
    console.log('Započinje checkout');
    return this.http.get(`${environment.apiHost}tourist/shopping-cart/checkout`);
  }
}