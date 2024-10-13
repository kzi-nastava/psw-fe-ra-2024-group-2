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
        console.log(environment.apiHost + '/profile');
        return this.http.get<Profile>(environment.apiHost + 'profile')
    }
}