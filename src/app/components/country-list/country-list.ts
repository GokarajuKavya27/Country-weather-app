import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './country-list.html',
  styleUrls: ['./country-list.css']
})
export class CountryListComponent implements OnInit {

  countries: any[] = [];
  searchText: string = '';
  loading: boolean = true;
  error: string = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getCountries().subscribe({
      next: (data: any) => {
        this.countries = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load countries. Please check your internet connection.';
        this.loading = false;
      }
    });
  }

  get filteredCountries(): any[] {
    if (!this.searchText.trim()) {
      return this.countries;
    }
    return this.countries.filter(country =>
      country.name.common.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  trackByCountry(index: number, country: any): string {
    return country.name.common;
  }

  goToDetails() {
    if (!this.searchText || this.countries.length === 0) {
      alert('Please enter a country name to search');
      return;
    }

    const search = this.searchText.trim().toLowerCase();

    const found = this.countries.find(
      c => c.name.common.toLowerCase() === search
    );

    if (found) {
      this.router.navigate(['/details', found.name.common]);
    } else {
      alert('Country not found. Please check the spelling and try again.');
    }
  }
}
