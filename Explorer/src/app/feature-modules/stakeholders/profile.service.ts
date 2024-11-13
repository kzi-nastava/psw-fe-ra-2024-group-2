import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RateApp } from "./model/rate-app.model";
import { environment } from "src/env/environment";
import { TouristPosition } from "./model/tourist-position";
import { Person } from "./model/person";
import { ProfileMessage } from "./model/profile-message.model";
import { Profile } from "./model/profile.model";

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    constructor(private http: HttpClient) { }
    
    getProfile(): Observable<Profile> {
        return this.http.get<Profile>(environment.apiHost + 'profile')
    }

    // Dodajemo novu metodu za dobavljanje svih profila
    getAll(): Observable<Profile[]> {
        return this.http.get<Profile[]>(environment.apiHost + 'profile/all');
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

    getTouristPosition(userId: number): Observable<Person>{
        return this.http.get<Person>(environment.apiHost + `person/${userId}`);
    }  

    // profile.service.ts
    sendMessage(message: ProfileMessage): Observable<ProfileMessage> {
      return this.http.post<ProfileMessage>(environment.apiHost + 'profile/messaging/new/message', message);
    }
}