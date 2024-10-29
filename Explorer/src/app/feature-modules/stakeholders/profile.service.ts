import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Profile } from "./model/profile.model";
import { RateApp } from "./model/rate-app.model";
import { environment } from "src/env/environment";
import { TouristPosition } from "./model/tourist-position";
import { Person } from "./model/person";

@Injectable({
    providedIn: 'root'
  })
export class ProfileService {
    constructor(private http: HttpClient) { }
    
    getProfile(): Observable<Profile> {
        return this.http.get<Profile>(environment.apiHost + 'profile')
    }

    updateProfile(result: Profile) {
        return this.http.put(environment.apiHost + 'profile', result)
    }
    addRateAppAuthor(rateApp: RateApp): Observable<RateApp> {
        return this.http.post<RateApp>(environment.apiHost + 'author/ratingApplication', rateApp);
      }
    addRateAppTourist(rateApp: RateApp): Observable<RateApp> {
        return this.http.post<RateApp>(environment.apiHost + 'tourist/ratingApplication', rateApp);
      }
    updateTouristPosition(userId: number, positionDto: TouristPosition): Observable<Person> {
      return this.http.put<Person>(environment.apiHost + `person/${userId}/position`, positionDto);
    }
    getTouristPosition(userId: number): Observable<TouristPosition>{
      return this.http.get<TouristPosition>(environment.apiHost + `person/${userId}`);
    }  
}