import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Pizzeria } from './pizzeria/pizzeria/pizzeria'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Pizzeria], // <-- Agrega Pizzeria aquí
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'pizzeriaExamAngular';
}