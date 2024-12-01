import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SocialEncounterDto, HiddenLocationEncounterDto, MiscEncounterDto } from './model/encounter.model';

@Injectable({
  providedIn: 'root'
})
export class EncounterService {
  private apiUrl = 'https://localhost:44333/api/encounters'; // Adjust API URL as per your setup

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

}
