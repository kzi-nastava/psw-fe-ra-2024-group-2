import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from './shared/model/tour.module';
import { Tour } from './model/tour.model';
import { Equipment } from '../administration/model/equipment.model';
import { Checkpoint } from './model/checkpoint.model';


@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http: HttpClient) { }

  getTours(): Observable<PagedResult<Tour>>{
    return this.http.get<PagedResult<Tour>>('https://localhost:44333/api/author/tour')
  }

  getAllEquipment(): Observable<PagedResult<Equipment>>{
    return this.http.get<PagedResult<Equipment>>('https://localhost:44333/api/author/tour/equipment/getAll')
  }

  updateTour(result: Tour){
    return this.http.put('https://localhost:44333/api/author/tour/equipment', result)
  }
  
  getCheckpoints(): Observable<PagedResult<Checkpoint>>{
    return this.http.get<PagedResult<Checkpoint>>('https://localhost:44333/api/author/checkpoint/checkpoints/getAll')
  }

}
