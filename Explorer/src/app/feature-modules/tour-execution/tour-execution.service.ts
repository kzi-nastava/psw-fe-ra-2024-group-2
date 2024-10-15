import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tour } from './model/tour-model';
import { PagedResult } from '../tour-authoring/shared/model/tour.module';
import { TourReview } from './model/tour-review.model';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http: HttpClient) {}

  getTours():   Observable<PagedResult<Tour>>{
    return this.http.get<PagedResult<Tour>>('https://localhost:44333/api/tour/reviews/get/tours');
  }

  getReviews(tourId: number):   Observable<PagedResult<TourReview>>{
    return this.http.get<PagedResult<TourReview>>(`https://localhost:44333/api/tour/reviews/get/${tourId}`);
  }

}
