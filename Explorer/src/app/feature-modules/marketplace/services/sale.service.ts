import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { TourSale } from '../model/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<TourSale[]> {
    return this.http.get<TourSale[]>('https://localhost:44333/api/user/tourSale');
  }
}
