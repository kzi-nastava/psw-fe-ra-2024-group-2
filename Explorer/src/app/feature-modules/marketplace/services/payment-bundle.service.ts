import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Bundle, FullBundle } from "../model/bundle.model";
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

    getBundles(): Observable<PagedResult<FullBundle>> {
        return this.http.get<PagedResult<FullBundle>>(`${environment.apiHost}bundles/all`);
    }

    getMyBundles(): Observable<PagedResult<FullBundle>> {
        return this.http.get<PagedResult<FullBundle>>(`${environment.apiHost}author/bundles`);
    }

    publishBundle(id: number): Observable<Bundle> {
        return this.http.post<Bundle>(environment.apiHost + 'author/bundles/publish?id=' + id, {});
    }

    updateBundle(id: number, bundle: Bundle): Observable<Bundle> {
        return this.http.put<Bundle>(environment.apiHost + 'author/bundles' + '?id=' + id, bundle);
    }

    deleteBundle(id: number): Observable<Bundle> {
        return this.http.delete<Bundle>(environment.apiHost + 'author/bundles' + '?id=' + id);
    }
}