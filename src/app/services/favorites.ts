import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'favorite-countries';
  private favoritesSubject = new BehaviorSubject<string[]>(this.loadFavorites());
  public favorites$ = this.favoritesSubject.asObservable();

  constructor() {}

  private loadFavorites(): string[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    console.log('Loading favorites from localStorage:', stored);
    return stored ? JSON.parse(stored) : [];
  }

  private saveFavorites(favorites: string[]): void {
    console.log('Saving favorites to localStorage:', favorites);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }

  isFavorite(countryName: string): boolean {
    return this.favoritesSubject.value.includes(countryName);
  }

  addToFavorites(countryName: string): void {
    if (!this.isFavorite(countryName)) {
      const updated = [...this.favoritesSubject.value, countryName];
      this.saveFavorites(updated);
    }
  }

  removeFromFavorites(countryName: string): void {
    const updated = this.favoritesSubject.value.filter(name => name !== countryName);
    this.saveFavorites(updated);
  }

  toggleFavorite(countryName: string): void {
    console.log('Toggling favorite for:', countryName);
    console.log('Current favorites:', this.favoritesSubject.value);
    if (this.isFavorite(countryName)) {
      this.removeFromFavorites(countryName);
      console.log('Removed from favorites');
    } else {
      this.addToFavorites(countryName);
      console.log('Added to favorites');
    }
    console.log('New favorites:', this.favoritesSubject.value);
  }

  getFavorites(): string[] {
    const favorites = [...this.favoritesSubject.value];
    console.log('getFavorites() returning:', favorites);
    return favorites;
  }
}