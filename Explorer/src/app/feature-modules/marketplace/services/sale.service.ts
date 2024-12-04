import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PagedResult } from '../marketplace.module';
import { TourPayment, TourSale } from '../model/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<TourSale[]> {
    return this.http.get<TourSale[]>('https://localhost:44333/api/user/tourSale');
  }

  createTourSale(sale: TourSale): Observable<TourSale> {
    return this.http.post<TourSale>(`https://localhost:44333/api/user/tourSale`, sale);
  }

  getToursByUserId(): Observable<PagedResult<TourPayment>> {
    return this.http.get<PagedResult<TourPayment>>('https://localhost:44333/api/author/tour');
  }

  updateTourSale(id: number, sale: TourSale): Observable<TourSale> {
    return this.http.put<TourSale>(`https://localhost:44333/api/user/tourSale/${id}`, sale);
  }
  
  deleteTourSale(id: number): Observable<void> {
    return this.http.delete<void>(`https://localhost:44333/api/user/tourSale/${id}`);
  }
  
}
