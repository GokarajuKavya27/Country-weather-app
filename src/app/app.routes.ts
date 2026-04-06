import { Routes } from '@angular/router';
import { CountryListComponent } from './components/country-list/country-list';
import { CountryDetailComponent } from './components/country-detail/country-detail';
import { Favorites } from './components/favorites/favorites';

export const routes: Routes = [
  { path: '', component: CountryListComponent },
  { path: 'favorites', component: Favorites },
  { path: 'details/:name', component: CountryDetailComponent }
];