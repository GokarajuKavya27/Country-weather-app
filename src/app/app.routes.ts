import { Routes } from '@angular/router';
import { CountryListComponent } from './components/country-list/country-list';
import { CountryDetailComponent } from './components/country-detail/country-detail';

export const routes: Routes = [
  { path: '', component: CountryListComponent },
  { path: 'details/:name', component: CountryDetailComponent }
];