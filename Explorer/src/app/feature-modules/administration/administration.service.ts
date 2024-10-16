import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Account } from './model/account.model';
import { AccountDTO } from './model/accountdto.model';
import { ClubInviteDTO } from './model/clubinvitedto.model';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'administration/equipment')
  }

  deleteEquipment(id: number): Observable<Equipment> {
    return this.http.delete<Equipment>(environment.apiHost + 'administration/equipment/' + id);
  }

  addEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(environment.apiHost + 'administration/equipment', equipment);
  }

  updateEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(environment.apiHost + 'administration/equipment/' + equipment.id, equipment);
  }

  getAccount(): Observable<PagedResults<Account>> {
    return this.http.get<PagedResults<Account>>('https://localhost:44333/api/administrator/account');
  }
  getClubInvites(page: number, pageSize: number): Observable<PagedResults<ClubInviteDTO>> {
    return this.http.get<PagedResults<ClubInviteDTO>>(`https://localhost:44333/api/tourist/clubInvite/getClubInvites?page=${page}&pageSize=${pageSize}`);
  }
  getFilteredTourists(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`https://localhost:44333/api/tourist/clubInvite/getTourists?page=${page}&pageSize=${pageSize}`);
  }
  inviteTouristToClub(clubInviteDTO: ClubInviteDTO): Observable<any> {
    return this.http.put(`https://localhost:44333/api/tourist/clubInvite/invite`, clubInviteDTO);
  }

  removeTouristFromClub(clubInviteDTO: ClubInviteDTO): Observable<any> {
    return this.http.request('delete', `https://localhost:44333/api/tourist/clubInvite/remove`, { body: clubInviteDTO });
  }
}
