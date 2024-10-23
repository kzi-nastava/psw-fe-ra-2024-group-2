import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from './shared/model/tour.module';
import { Tour } from './model/tour.model';
import { Equipment } from '../administration/model/equipment.model';
import { Checkpoint } from './model/checkpoint.model';
import { Object } from './model/object.model';
import { ObjectFormComponent } from './object-form/object-form.component';


@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http: HttpClient) { }

  getTours(): Observable<PagedResult<Tour>>{
    return this.http.get<PagedResult<Tour>>('https://localhost:44333/api/author/tour')
  }

  getTourById(tourId: number): Observable<Tour> {
    return this.http.get<Tour>(`https://localhost:44333/api/author/tour/${tourId}`);
  }

  getObjects(): Observable<PagedResult<Object>>{
    return this.http.get<PagedResult<Object>>('https://localhost:44333/api/author/tourObject')
  }

  updateObject([long, lat]: [number, number], id?: number): Observable<Object> {
    return this.http.put<Object>(`https://localhost:44333/api/author/tourObject/${id}`, [long, lat]);
  }


  getAllEquipment(): Observable<PagedResult<Equipment>>{
    return this.http.get<PagedResult<Equipment>>('https://localhost:44333/api/author/tour/equipment/getAll')
  }

  updateTour(result: Tour){
    console.log(result)
    return this.http.put('https://localhost:44333/api/author/tour/equipment', result)
  }
  
  getCheckpoints(): Observable<PagedResult<Checkpoint>>{
    return this.http.get<PagedResult<Checkpoint>>('https://localhost:44333/api/author/checkpoint/checkpoints/getAll')
  }

  addCheckpoint(checkpoint: Checkpoint): Observable<Checkpoint>{
    return this.http.post<Checkpoint>('https://localhost:44333/api/author/checkpoint', checkpoint)
  }

  updateTourCheckpoints(tour: Tour){
    return this.http.put('https://localhost:44333/api/author/tour/checkpoints', tour);
  }

  addObject(object: Object): Observable<Object>{
    return this.http.post<Object>('https://localhost:44333/api/author/tourObject', object);
  }

  addTour(tour : Tour): Observable<Tour>{
    return this.http.post<Tour>('https://localhost:44333/api/author/tour', tour)
  }


}
