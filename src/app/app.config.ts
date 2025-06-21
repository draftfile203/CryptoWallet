import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp } from '@angular/fire/app';
import { getApps, initializeApp } from 'firebase/app';
import { environment } from '../environment/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes), 
     provideClientHydration(withEventReplay()),
     provideAnimations(),
      CommonModule,
     provideHttpClient(),
    provideFirebaseApp(() => {
      const existingApps = getApps();
      return existingApps.length === 0
        ? initializeApp(environment.firebase)
        : existingApps[0];
    }),
     provideFirestore(() => getFirestore())],

};
