import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../tour-authoring/shared/model/tour.module';
import { TourIssueReport } from './model/tour-issue-report.model';
import { TourIssueComment } from './model/tour-issue-comment.model'
import { Tour } from '../tour-authoring/model/tour.model';
import { TourReview } from './model/tour-review.model';
import { environment } from 'src/env/environment';
import { TourExecution } from './model/tourExecution-model';
@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http: HttpClient) { }

  closeTour(tourId: number): Observable<string> {
    return this.http.delete<string>('https://localhost:44333/api/administration/tourIssueReportReview/deleteTour/' + tourId);
  }

  closeTourIssueReport(tourIssueReport: TourIssueReport): Observable<TourIssueReport>{
    return this.http.put<TourIssueReport>('https://localhost:44333/api/administration/tourIssueReportReview/closeReport', tourIssueReport)
  }

  setReportFixUntilDate(tourIssueReport: TourIssueReport, adminId: number): Observable<TourIssueReport>{
    return this.http.put<TourIssueReport>('https://localhost:44333/api/administration/tourIssueReportReview/setFixUntilDate/'+adminId, tourIssueReport)
  }

  addTourIssueComment(tourIssueComment: TourIssueComment, userId: number): Observable<TourIssueComment>{
    return this.http.post<TourIssueComment>('https://localhost:44333/api/tourIssueComment/comment/'+userId, tourIssueComment)
  }

  getTourIssueReportById(tourIssueReportId: number): Observable<TourIssueReport>{
    return this.http.get<TourIssueReport>('https://localhost:44333/api/tourIssueReportView/tourIssueReport/'+tourIssueReportId)
  }

  getTourIssueReport(userId: number): Observable<PagedResult<TourIssueReport>>{
    return this.http.get<PagedResult<TourIssueReport>>('https://localhost:44333/api/tourIssueReportView/'+userId)
  }

  getTourById(id: number): Observable<Tour>{
    return this.http.get<Tour>('https://localhost:44333/api/tourIssueReportView/tour/'+id)
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
    return this.http.post<TourExecution>(`https://localhost:44333/api/tour/execution/${tourId}`, {});
  }

  updateReview(review: TourReview): Observable<TourReview>{
    return this.http.put<TourReview>('https://localhost:44333/api/tour/reviews/update/review', review);
  }

  getTourIssueComments(tourIssueReportId: number) : Observable<PagedResult<TourIssueComment>>{
    return this.http.get<PagedResult<TourIssueComment>>('https://localhost:44333/api/tourIssueComment/comments/'+tourIssueReportId);
  }

  markAsDone(tourIssueReport: TourIssueReport) : Observable<TourIssueReport>{
    return this.http.put<TourIssueReport>('https://localhost:44333/api/tourist/tourIssueReport/resolvedReport', tourIssueReport)
  }

  alertAdmin(tourIssueReport: TourIssueReport) : Observable<TourIssueReport>{
    return this.http.put<TourIssueReport>('https://localhost:44333/api/tourist/tourIssueReport/alertAdmin', tourIssueReport)
  }
}





