import 'zone.js'; // <-- ¡Esta línea es la que faltaba para solucionar el error!
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));