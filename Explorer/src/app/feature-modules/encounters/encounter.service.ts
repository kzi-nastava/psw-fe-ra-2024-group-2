import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SocialEncounterDto, HiddenLocationEncounterDto, MiscEncounterDto, UnifiedEncounterDto, EncounterDto } from './model/encounter.model';
import { UserLevelDto } from './model/userLevel.model';

@Injectable({
  providedIn: 'root'
})
export class EncounterService {
  private apiUrl = 'https://localhost:44333/api/encounters';
  private levelUrl = 'https://localhost:44333/api/userLevels'; 

  constructor(private http: HttpClient) {}

  // Create encounter based on the type
  createEncounter(encounterDto: SocialEncounterDto | HiddenLocationEncounterDto | MiscEncounterDto): Observable<any> {
    let url = '';

    // Determine the appropriate endpoint based on encounter type
    if ((encounterDto as SocialEncounterDto).requiredPeople !== undefined) {
      // Social encounter
      url = `${this.apiUrl}/social`;
    } else if ((encounterDto as HiddenLocationEncounterDto).image) {
      // Hidden location encounter
      url = `${this.apiUrl}/hidden-location`;
    } else if ((encounterDto as MiscEncounterDto).actionDescription) {
      // Misc encounter
      url = `${this.apiUrl}/misc`;
    } else {
      throw new Error('Invalid encounter type');
    }

    // Post request to the determined endpoint
    return this.http.post(url, encounterDto);
  }

  // Update encounter based on the type
  updateEncounter(encounterDto: SocialEncounterDto | HiddenLocationEncounterDto | MiscEncounterDto): Observable<any> {
    let url = '';

    // Determine the appropriate endpoint based on encounter type
    if ((encounterDto as SocialEncounterDto).requiredPeople !== undefined) {
      // Social encounter
      url = `${this.apiUrl}/social`;
    } else if ((encounterDto as HiddenLocationEncounterDto).image) {
      // Hidden location encounter
      url = `${this.apiUrl}/hidden-location`;
    } else if ((encounterDto as MiscEncounterDto).actionDescription) {
      // Misc encounter
      url = `${this.apiUrl}/misc`;
    } else {
      throw new Error('Invalid encounter type');
    }

    // Put request to the determined endpoint
    return this.http.put(url, encounterDto);
  }

  // Delete encounter by id
  deleteEncounter(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

    // Fetch all encounters
    getAllEncounters(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl); 
    }

  getEncounterById(id: number): Observable<EncounterDto> {
    return this.http.get<EncounterDto>(`${this.apiUrl}/id/${id}`)
  }

  // Method to update the Misc Encounter
  updateMiscEncounter(encounter: UnifiedEncounterDto): Observable<UnifiedEncounterDto> {
    return this.http.put<UnifiedEncounterDto>(`${this.apiUrl}/misc`, encounter);
  }

  updateUserLevel(userLevelDto: UserLevelDto): Observable<any> {
    const url = `${this.levelUrl}`;
    console.log(userLevelDto);
    return this.http.put<UserLevelDto>(url, userLevelDto);
  }
  updateHiddenEncounter(encounter: UnifiedEncounterDto): Observable<UnifiedEncounterDto> {
    return this.http.put<UnifiedEncounterDto>(`${this.apiUrl}/hidden-location`, encounter);
  }
  
  updateSocialEncounter(encounter: UnifiedEncounterDto): Observable<UnifiedEncounterDto> {
    return this.http.put<UnifiedEncounterDto>(`${this.apiUrl}/social`, encounter);
  }
  removeUserFromSocialEncounters(id: number | undefined) {
    return this.http.put<UnifiedEncounterDto>(`${this.apiUrl}/removesocial`, id);
  }
  getUserLevel(userId: number): Observable<UserLevelDto> {
    const url = `${this.levelUrl}/${userId}`;
    return this.http.get<UserLevelDto>(url);
  }
}
