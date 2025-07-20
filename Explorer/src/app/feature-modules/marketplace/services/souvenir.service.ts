import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Souvenir } from "../model/souvenir.model";
import { environment } from "src/env/environment";
import { Observable } from "rxjs";
import { PagedResult } from "../marketplace.module";

@Injectable({
    providedIn: 'root'
})
export class SouvenirService {
    constructor(private http: HttpClient) {}

    createSouvenir(souvenir: Souvenir): Observable<Souvenir> {
        return this.http.post<Souvenir>(`${environment.apiHost}author/souvenirs`, souvenir);
    }

    showMySouvenirs(): Observable<PagedResult<Souvenir>> {
        return this.http.get<PagedResult<Souvenir>>(`${environment.apiHost}author/souvenirs`)
    }

    updateSouvenir(souvenir: Souvenir): Observable<Souvenir> {
        return this.http.put<Souvenir>(`${environment.apiHost}author/souvenirs`, souvenir)
    }

    deleteSouvenir(id: number): Observable<Souvenir> {
        return this.http.delete<Souvenir>(`${environment.apiHost}author/souvenirs?id=${id}`)
    }

    showAllSouvenirs(): Observable<PagedResult<Souvenir>> {
        return this.http.get<PagedResult<Souvenir>>(`${environment.apiHost}souvenirs`);
    }

    getBoughtSouvenirs(): Observable<Souvenir[]> {
        return this.http.get<Souvenir[]>(`${environment.apiHost}tourist/shopping-cart/purchasedSouvenirs`);
    }
}