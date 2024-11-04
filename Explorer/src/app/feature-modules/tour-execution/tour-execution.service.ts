import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../tour-authoring/shared/model/tour.module';
import { TourIssueReport } from './model/tour-issue-report.model';
import { Tour } from '../tour-authoring/model/tour.model';
import { TourReview } from './model/tour-review.model';
import { environment } from 'src/env/environment';
import { TourExecution } from './model/tourExecution-model';
import { TouristPosition } from '../stakeholders/model/tourist-position';
import { Checkpoint } from '../tour-authoring/model/checkpoint.model';
@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http: HttpClient) { }

  getTourIssueReport(): Observable<PagedResult<TourIssueReport>>{
    return this.http.get<PagedResult<TourIssueReport>>('https://localhost:44333/api/administration/tourIssueReportReview')
  }

  getById(id: number): Observable<Tour>{
    return this.http.get<Tour>('https://localhost:44333/api/administration/tourIssueReportReview/'+id)
  }

  getTours(): Observable<PagedResult<Tour>>{
    return this.http.get<PagedResult<Tour>>('https://localhost:44333/api/tourist/tourIssueReport')
  }

  addTourIssueReport(report: TourIssueReport): Observable<TourIssueReport>{
    return this.http.post<TourIssueReport>('https://localhost:44333/api/tourist/tourIssueReport', report)
  }

  getAllTours():   Observable<PagedResult<Tour>>{
    return this.http.get<PagedResult<Tour>>('https://localhost:44333/api/tour/reviews/get/tours');
  }

  getReviews(tourId: number):   Observable<PagedResult<TourReview>>{
    return this.http.get<PagedResult<TourReview>>(`https://localhost:44333/api/tour/reviews/get/${tourId}`);
  }

  addReview(tourReview: TourReview): Observable<TourReview>{
    return this.http.post<TourReview>(`${environment.apiHost}tour/reviews`, tourReview)
  }

  startTour(tourId: number): Observable<TourExecution>{
    console.log("Tour Id je :",tourId)
    return this.http.post<TourExecution>(`https://localhost:44333/api/tour/execution/${tourId}`, {});
  }

  updateReview(review: TourReview): Observable<TourReview>{
    return this.http.put<TourReview>('https://localhost:44333/api/tour/reviews/update/review', review);
  }
  checkTouristPosition(tourist : TouristPosition): Observable<TourExecution>{
    return this.http.post<TourExecution>('https://localhost:44333/api/tour/execution/checkTouristPosition', tourist);
  }
  loadTourExecution(tourId: number): Observable<TourExecution>{
    return this.http.get<TourExecution>(`https://localhost:44333/api/tour/execution/load`);
  }

  getTourCheckpoints(checkpointIds: number[]): Observable<PagedResult<Checkpoint>> {
    return this.http.post<PagedResult<Checkpoint>>('https://localhost:44333/api/tour/execution/checkpoints/getSome', checkpointIds);
  }
  endTour(tour: TourExecution): Observable<TourExecution>{
    return this.http.post<TourExecution>('https://localhost:44333/api/tour/execution/end',tour);
  }

}





