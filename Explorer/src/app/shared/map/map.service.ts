import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private apiKey = '0055a4cfdd23466bb06192705241112';

  constructor(private http: HttpClient) {}

  search(street: string): Observable<any> {
    return this.http.get(
      'https://nominatim.openstreetmap.org/search?format=json&q=' + street
    );
  }

  reverseSearch(lat: number, lon: number): Observable<any> {
    return this.http.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&<params>`
    );
  }

  getWeatherForecastByDay(latitude: number, longitude: number): Observable<any> {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${latitude},${longitude}&days=1`;
    
    return this.http.get(url); 
  }
  


}
