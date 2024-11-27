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
import { TouristPosition } from '../stakeholders/model/tourist-position';
import { Checkpoint } from '../tour-authoring/model/checkpoint.model';
import { Tour as ExecutionTour } from './model/tour-model'; 
import { EventModel } from '../tour-authoring/model/event.model';
import { map } from 'rxjs/operators';
import { PersonalDairy } from './model/personalDiary.model'
import { Chapter } from './model/chapter.model';
import { Diary } from './model/diary.model';

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

  getTourIssueComments(tourIssueReportId: number) : Observable<PagedResult<TourIssueComment>>{
    return this.http.get<PagedResult<TourIssueComment>>('https://localhost:44333/api/tourIssueComment/comments/'+tourIssueReportId);
  }

  markAsDone(tourIssueReport: TourIssueReport) : Observable<TourIssueReport>{
    return this.http.put<TourIssueReport>('https://localhost:44333/api/tourist/tourIssueReport/resolvedReport', tourIssueReport)
  }

  alertAdmin(tourIssueReport: TourIssueReport) : Observable<TourIssueReport>{
    return this.http.put<TourIssueReport>('https://localhost:44333/api/tourist/tourIssueReport/alertAdmin', tourIssueReport)
  }

  addToCart(tourId: number): Observable<any> {
    return this.http.post(`https://localhost:44333/api/tourist/shopping-cart/add/${tourId}`, {});
  }

  getPurchasedTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>('https://localhost:44333/api/tourist/shopping-cart/purchasedTours');
  }

  GetAllEventsWithinRange(tourist : TouristPosition): Observable<PagedResult<EventModel>> {
    return this.http.post<PagedResult<EventModel>>('https://localhost:44333/api/tour/execution/eventsWithinRange',tourist)
  }
  acceptEvent(event: EventModel): Observable<any> {
    return this.http.post('https://localhost:44333/api/tour/execution/acceptEvent', event);
  }

  getDiaryForExecution(userId: number): Observable<PersonalDairy[]> {
    return this.http.get<PersonalDairy[]>(`https://localhost:44333/api/user/personal-dairy/${userId}`);
  }

  createDiary(diary: Diary): Observable<Diary> {
    return this.http.post<Diary>('https://localhost:44333/api/user/personal-dairy', diary);
  }

  addChapter(diaryId: number, chapter: Chapter): Observable<Chapter> {
    return this.http.post<Chapter>(`https://localhost:44333/api/user/personal-dairy/${diaryId}/chapters`, chapter);
  }  
  
  
  getDiaryByTourExecutionId(tourExecutionId: number): Observable<Diary>{
    return this.http.get<Diary>('https://localhost:44333/api/user/personal-dairy/TourExecutionId/'+tourExecutionId)
  }

  getChaptersForDiary(diaryId: number) : Observable<PagedResult<Chapter>>{
    return this.http.get<PagedResult<Chapter>>('https://localhost:44333/api/user/personal-dairy/'+diaryId+"/chapters");
  }

  editDiary(diary: Diary) : Observable<Diary>{
    return this.http.put<Diary>('https://localhost:44333/api/user/personal-dairy/'+diary.id, diary)
  }

  deleteDiary(diary: Diary) : Observable<string>{
    return this.http.delete<string>('https://localhost:44333/api/user/personal-dairy/'+ diary.id,  { responseType: 'text' as 'json' })
  }

  editChapter(chapter: Chapter) : Observable<Chapter>{
    return this.http.put<Chapter>('https://localhost:44333/api/user/personal-dairy/'+chapter.personalDairyId+"/chapters/"+chapter.chapterId, chapter)
  }

  deleteChapter(chapter: Chapter) : Observable<string>{
    return this.http.delete<string>('https://localhost:44333/api/user/personal-dairy/'+chapter.personalDairyId+"/chapters/"+chapter.chapterId,  { responseType: 'text' as 'json' })
  }
}





