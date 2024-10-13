import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Profile } from "./model/profile.model";
import { environment } from "src/env/environment";

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
}