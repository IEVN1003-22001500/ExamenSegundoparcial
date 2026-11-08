import { Routes } from '@angular/router';
import { Pizzeria } from './pizzeria/pizzeria/pizzeria';

export const routes: Routes = [
  { path: 'pizzeria', component: Pizzeria },
  { path: '', redirectTo: 'pizzeria', pathMatch: 'full' }
];