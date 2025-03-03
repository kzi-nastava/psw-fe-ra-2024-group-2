import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tour } from './model/tour.model';
import { environment } from 'src/env/environment';
import { Observable, of } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { KeyPoint } from './model/keyPoint.model';
import { TourRate } from './model/tourRate.model';

@Injectable({
  providedIn: 'root'
})
export class TourService {

  constructor(private http: HttpClient) { }

  getAllTours(): Observable<PagedResults<Tour>> {
    return this.http.get<PagedResults<Tour>>(environment.apiHost + 'tour/getAllTours')
  }

  getGuideTours(guideId: number): Observable<Tour[]> {
    return this.http.get<Tour[]>(environment.apiHost + 'tour/getGuideTours/' + guideId);
  }     // dodati guide id

  getTourById(tourId: number | null): Observable<Tour> {
    return this.http.get<Tour>(environment.apiHost + 'tour/getById/' + tourId);
  }

  deleteTour(id: number): Observable<Tour> {
    return this.http.delete<Tour>(environment.apiHost + 'tour/delete/' + id);
  }

  createTour(tour: Tour): Observable<Tour> {
    return this.http.post<Tour>(environment.apiHost + 'tour/', tour);
  }

  updateTour(tour: Tour): Observable<Tour> {
    return this.http.put<Tour>(environment.apiHost + 'tour/update/' + tour.id, tour);
  }

  sendTestEmail(): Observable<string> {
    return this.http.get<string>(`${environment.apiHost}tour/sendTestEmail`, { responseType: 'text' as 'json' });
  }
  

  // tour.service.ts
  cancelTour(tourId: number): Observable<string> {
    return this.http.post<string>(`${environment.apiHost}tour/cancelTour/${tourId}`, {}, { responseType: 'text' as 'json' });
  }

  getTourRateByUser(tourId: number): Observable<TourRate> {
    return this.http.get<TourRate>(`${environment.apiHost}tour/getTourRateByUser/${tourId}`);
  }
  
  getTourRatesByGuide(tourId: number): Observable<TourRate[]> {
    return this.http.get<TourRate[]>(`${environment.apiHost}tour/getTourRates/${tourId}`);
  }
  
  submitRating(rating: TourRate): Observable<any> {
    //return of({ message: 'Rating submitted successfully!', status: 'success' });  // Mocked response
    
    return this.http.post(environment.apiHost + `tour/createTourRate`, rating);
  }
}
