import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api';
 
@Component({
  selector: 'app-country-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country-detail.html',
  styleUrls: ['./country-detail.css']
})
export class CountryDetailComponent implements OnInit {
 
  country: any;
  weather: any;
  loading: boolean = true;
  error: string = '';
 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}
 
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
   
      if (!name) {
        this.error = "No country name provided";
        this.loading = false;
        return;
      }
   
      this.loading = true;
      this.error = '';
      
      // Fetch all countries
      this.api.getCountries().subscribe({
        next: (data: any) => {
   
          // Find exact match
          this.country = data.find(
            (c: any) => c.name.common.toLowerCase() === name.toLowerCase()
          );
          this.cdr.markForCheck();
   
          if (this.country) {
            const capital = this.country.capital?.[0];
   
            console.log("Country:", this.country);
            console.log("Capital:", capital);
   
            if (capital) {
              this.getWeather(capital);
            } else {
              this.error = "Capital not found";
              this.loading = false;
              this.cdr.markForCheck();
            }
   
          } else {
            this.error = "Country not found";
            this.loading = false;
            this.cdr.markForCheck();
          }
        },
   
        error: (err) => {
          console.error("Country Error:", err);
          this.error = "Failed to load country details";
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    });
  }
 
  // 🌤 Fetch weather
  getWeather(city: string) {
    console.log('Fetching weather for:', city);
 
    this.api.getWeather(city).subscribe({
      next: (data: any) => {
        console.log('Weather API Response:', data);
        this.weather = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Weather Error:', err);
        this.weather = null;
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Get currency keys for iteration
  getCurrencyKeys(currencies: any): string[] {
    return Object.keys(currencies || {});
  }

  // Navigate back
  goBack() {
    this.router.navigate(['/']);
  }
}
