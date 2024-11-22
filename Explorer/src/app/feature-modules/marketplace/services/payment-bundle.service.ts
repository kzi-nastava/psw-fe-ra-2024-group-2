import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Bundle } from "../model/bundle.model";
import { environment } from "src/env/environment";
import { PagedResult } from "../../tour-authoring/shared/model/tour.module";

@Injectable({
    providedIn: 'root'
})
export class PaymentBundleService {
    constructor(private http: HttpClient) {}

    createBundle(bundle: Bundle): Observable<Bundle> {
        return this.http.post<Bundle>(`${environment.apiHost}author/bundles`, bundle);
    }

    getBundles(): Observable<PagedResult<Bundle>> {
        return this.http.get<PagedResult<Bundle>>(`${environment.apiHost}bundles/all`);
    }
}