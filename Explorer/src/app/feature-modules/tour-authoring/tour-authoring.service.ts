import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { PagedResult } from './shared/model/tour.module';
import { Tour } from './model/tour.model';
import { Equipment } from '../administration/model/equipment.model';
import { Checkpoint } from './model/checkpoint.model';
import { Object } from './model/object.model';
import { ObjectFormComponent } from './object-form/object-form.component';
import { LocationDto } from '../tour-execution/model/location.model';
import { TourIssueNotification } from '../layout/model/tour-notification.model';
import { EventCategory, EventModel } from './model/event.model';
import { EventSubscription } from './model/eventSubscription.model';
import { AdventureCoinNotification } from '../marketplace/model/adventureCoinNotification.model';
import { Coupon } from './model/coupon.model';


@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {
  MarkAllAsRead(userId: number): Observable<void> {
    return this.http.put<void>(`https://localhost:44333/api/tourNotifications/markAllAsRead/${userId}`, null)
  }

  private tourDataSource = new BehaviorSubject<Tour | null>(null);
  tourData$ = this.tourDataSource.asObservable();
  setTourData(tour: Tour) {
    this.tourDataSource.next(tour);
  }
  getTourData(): Tour | null {
    return this.tourDataSource.getValue();
  }

  constructor(private http: HttpClient) { }

  getTours(): Observable<PagedResult<Tour>> {
    return this.http.get<PagedResult<Tour>>('https://localhost:44333/api/author/tour')
  }

  getTourById(tourId: number): Observable<Tour> {
    return this.http.get<Tour>(`https://localhost:44333/api/author/tour/${tourId}`);
  }

  getObjects(): Observable<PagedResult<Object>> {
    return this.http.get<PagedResult<Object>>('https://localhost:44333/api/author/tourObject')
  }

  updateObject([long, lat]: [number, number], id?: number): Observable<Object> {
    return this.http.put<Object>(`https://localhost:44333/api/author/tourObject/${id}`, [long, lat]);
  }


  getAllEquipment(): Observable<PagedResult<Equipment>> {
    return this.http.get<PagedResult<Equipment>>('https://localhost:44333/api/author/tour/equipment/getAll')
  }

  


  updateTour(result: Tour) {
    console.log(result)
    return this.http.put('https://localhost:44333/api/author/tour/equipment', result)
  }
  // getTourReport():Observable<TourIssueNotification>{
  //   return this.http.get('')
  // }
  readNotifications(UserId: number, TourIssueReportId: number): void {
    this.http.put<void>('https://localhost:44333/api/tourNotifications/markAsRead', { UserId, TourIssueReportId })
      .subscribe({
        next: () => {
          console.log('Notification read successfully.');
        },
        error: (error) => {
          console.error('Error reading notification:', error);
        }
      });
  }
  getNotifications(userId: number): Observable<PagedResult<TourIssueNotification>> {
    return this.http.get<PagedResult<TourIssueNotification>>('https://localhost:44333/api/tourNotifications/' + userId)
  }
  getCheckpoints(): Observable<PagedResult<Checkpoint>> {
    return this.http.get<PagedResult<Checkpoint>>('https://localhost:44333/api/author/checkpoint/checkpoints/getAll')
  }

  addCheckpoint(checkpoint: Checkpoint): Observable<Checkpoint> {
    return this.http.post<Checkpoint>('https://localhost:44333/api/author/checkpoint', checkpoint)
  }

  updateTourCheckpoints(tour: Tour) {
    return this.http.put('https://localhost:44333/api/author/tour/checkpoints', tour);
  }

  addObject(object: Object): Observable<Object> {
    return this.http.post<Object>('https://localhost:44333/api/author/tourObject', object);
  }

  addTour(tour: Tour): Observable<Tour> {
    return this.http.post<Tour>('https://localhost:44333/api/author/tour', tour)
  }

  subscribeEvent(subscription: number[]): Observable<PagedResult<EventModel>>  {
    return this.http.post<PagedResult<EventModel>>('https://localhost:44333/api/eventsubscription', subscription)
  }

  loadSubscribedEvents(subscription: number[]): Observable<PagedResult<EventModel>> {
    return this.http.post<PagedResult<EventModel>>('https://localhost:44333/api/eventsubscription/load', subscription)
  }
  

  GetSubscriptions(): Observable<number[]> {
    return this.http.get<number[]>('https://localhost:44333/api/eventsubscription/getSubscriptions')
  }
  unsubscribeEvent(): Observable<void> {
    return this.http.delete<void>('https://localhost:44333/api/eventsubscription')
  }

  addTourAndCheckpoints(tour: Tour, checkpoints: Checkpoint[]): Observable<Tour> {
    return this.http.post<Tour>('https://localhost:44333/api/author/tour/addNew', { tour, checkpoints });
  }

  getTourCheckpoints(checkpointIds: number[]): Observable<PagedResult<Checkpoint>> {
    console.log("Testic:" ,checkpointIds);
    return this.http.post<PagedResult<Checkpoint>>('https://localhost:44333/api/author/checkpoint/checkpoints/getSome', checkpointIds);
  }

  getNearbyTours(location: LocationDto): Observable<PagedResult<Tour>> {
    return this.http.post<PagedResult<Tour>>('https://localhost:44333/api/tourist/tour/nearby', location);
  }

  getPreferences(): Observable<any> {
    return this.http.get('https://localhost:44333/api/tourist/tour/preferences');
  }

  createPreference(preference: any): Observable<any> {
    return this.http.post('https://localhost:44333/api/tourist/tour/preferences', preference);
  }

  updatePreference(preference: any): Observable<any> {
    return this.http.put('https://localhost:44333/api/tourist/tour/preferences', preference);
  }
  addEvent(event: EventModel): Observable<EventModel> {
    return this.http.post<EventModel>('https://localhost:44333/api/author/event', event);
  }
  getEvents(): Observable<PagedResult<EventModel>> {
    return this.http.get<PagedResult<EventModel>>('https://localhost:44333/api/author/event')
  }
  getEventsSorted(): Observable<PagedResult<EventModel>> {
    return this.http.get<PagedResult<EventModel>>('https://localhost:44333/api/author/event/sorted')
  }
  getPopularEvents(): Observable<PagedResult<EventModel>> {
    return this.http.get<PagedResult<EventModel>>('https://localhost:44333/api/author/event/top')
  }
  getEventDetails(eventId: number): Observable<PagedResult<Tour>> {
    return this.http.get<PagedResult<Tour>>('https://localhost:44333/api/author/event/details/' + eventId)
  }
  //Coupons
  createCoupon(coupon: Coupon): Observable<Coupon> {
    return this.http.post<Coupon>('https://localhost:44333/api/author/coupon', coupon)
  }
  getCoupons(): Observable<PagedResult<Coupon>> {
    return this.http.get<PagedResult<Coupon>>('https://localhost:44333/api/author/coupon')
  }

  getAdventureCoinNotifications() {
    return this.http.get<AdventureCoinNotification[]>('https://localhost:44333/api/tourist/notifications');
  }
  
  markCoinNotificationAsRead(notificationId: number) {
    return this.http.put(`https://localhost:44333/api/adventure-coin-notifications/${notificationId}/mark-read`, {});
  }
  
  markAllCoinNotificationsAsRead(touristId: number) {
    return this.http.post(`https://localhost:44333/api/tourist/notifications/mark-all-as-read`, {});
  }
  
  
}
