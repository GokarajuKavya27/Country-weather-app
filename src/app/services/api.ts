import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

declare global {
  interface Window {
    OPENWEATHER_API_KEY?: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private get apiKey(): string | undefined {
    return window.OPENWEATHER_API_KEY;
  }

  constructor(private http: HttpClient) {}

  getCountries() {
    return this.http.get('https://restcountries.com/v3.1/all?fields=name,flags,region,population,capital,currencies');
  }

  getWeather(capital: string) {
    console.log('Fetching weather for:', capital);
    if (!this.apiKey) {
      return throwError(() => new Error('OpenWeather API key is not configured. Create src/assets/env.js and set window.OPENWEATHER_API_KEY.'));
    }
    return this.http.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${this.apiKey}&units=metric`
    );
  }
}