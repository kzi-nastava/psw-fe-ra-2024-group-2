import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Bundle } from "../model/bundle.model";
import { environment } from "src/env/environment";

@Injectable({
    providedIn: 'root'
})
export class PaymentBundleService {
    constructor(private http: HttpClient) {}

    createBundle(bundle: Bundle): Observable<Bundle> {
        return this.http.post<Bundle>(`${environment.apiHost}author/bundles`, bundle);
    }
}