import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Club } from '../tour-authoring/model/club.model';
import { PagedResult } from './shared/model/tour.module';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private http: HttpClient) { }

  getAllClubs(): Observable<PagedResult<Club>>{
    return this.http.get<PagedResult<Club>>('https://localhost:44333/api/tourist/club/')
  }

  addClub(result: Club): Observable<any> {
    return this.http.post('https://localhost:44333/api/tourist/club/', result);
  }

  updateClub(result: Club): Observable<any> {
    return this.http.put(`https://localhost:44333/api/tourist/club/${result.id}`, result);
  }
  
  
}
