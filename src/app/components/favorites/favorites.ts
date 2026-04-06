import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api';
import { FavoritesService } from '../../services/favorites';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, RouterModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit, OnDestroy {
  favoriteCountries: any[] = [];
  loading: boolean = false;
  error: string = '';
  countriesLoaded: boolean = false;
  allCountries: any[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private api: ApiService,
    private favoritesService: FavoritesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Favorites component initialized');
    this.loading = true;
    this.loadAllCountries();
    
    // Fallback timeout to prevent loading state from getting stuck
    setTimeout(() => {
      if (this.loading) {
        console.warn('Loading timeout - setting loading to false');
        this.loading = false;
      }
    }, 5000);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadAllCountries(): void {
    console.log('Loading all countries...');
    this.api.getCountries().subscribe({
      next: (data: any) => {
        console.log('Countries loaded successfully:', data);
        console.log('Data length:', Array.isArray(data) ? data.length : 'Not an array');
        this.allCountries = Array.isArray(data) ? data : [];
        this.countriesLoaded = true;
        this.loading = false;
        console.log('Setting loading to false, countries:', this.allCountries.length);
        this.cdr.markForCheck();
        this.filterFavoriteCountries();

        // Subscribe to favorites changes after initial load
        this.subscription.add(
          this.favoritesService.favorites$.subscribe(() => {
            this.filterFavoriteCountries();
          })
        );
      },
      error: (err: any) => {
        console.error('Failed to load countries:', err);
        console.error('Error details:', err.message || err);
        this.error = 'Failed to load countries. Please check your internet connection.';
        this.loading = false;
        this.countriesLoaded = true;
        console.log('Error occurred, setting loading to false');
        this.cdr.markForCheck();
      }
    });
  }

  private filterFavoriteCountries(): void {
    if (!this.countriesLoaded) {
      console.log('Countries not loaded yet, skipping filter');
      return;
    }

    const favoriteNames = this.favoritesService.getFavorites();
    console.log('=== FILTERING FAVORITES ===');
    console.log('Favorite names:', favoriteNames);
    console.log('All countries available:', this.allCountries.length);
    console.log('All countries data:', this.allCountries.slice(0, 3));

    if (!Array.isArray(this.allCountries)) {
      console.error('allCountries is not an array:', typeof this.allCountries);
      this.favoriteCountries = [];
      this.cdr.markForCheck();
      return;
    }

    this.favoriteCountries = this.allCountries.filter((country: any) => {
      const countryName = country?.name?.common || '';
      const isFav = favoriteNames.some(fav => fav.toLowerCase() === countryName.toLowerCase());
      if (isFav) {
        console.log(`Found favorite: ${countryName}`);
      }
      return isFav;
    });

    console.log('Filtered favorites count:', this.favoriteCountries.length);
    console.log('Filtered countries:', this.favoriteCountries.map((c: any) => c.name?.common));
    this.cdr.markForCheck();
  }

  removeFromFavorites(countryName: string): void {
    this.favoritesService.removeFromFavorites(countryName);
    this.cdr.markForCheck();
  }

  trackByCountry(index: number, country: any): string {
    return country.name.common;
  }
}
