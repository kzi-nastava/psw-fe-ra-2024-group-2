import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../tour-authoring/shared/model/tour.module';
import { TourIssueReport } from './model/tour-issue-report.model';
import { Tour } from '../tour-authoring/model/tour.model';

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
}
