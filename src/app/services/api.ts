import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  getCountries() {
    return this.http.get('https://restcountries.com/v3.1/all?fields=name,flags,region,population,capital,currencies');
  }

  getWeather(capital: string) {
    const apiKey = '829ad5c8437fc85dfa7db74efaed3723';
    console.log('Fetching weather for:', capital);
    return this.http.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
    );
  }
}