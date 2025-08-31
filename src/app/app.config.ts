import { ApplicationConfig } from '@angular/core';
import { InMemoryScrollingOptions, provideRouter, withComponentInputBinding, withInMemoryScrolling } 
from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';


import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { AlertInterceptor } from './core/interceptors/alert.interceptor';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';



const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

export const appConfig: ApplicationConfig = {
  providers: [

    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',    
        suffix: '.json'
      }),
      fallbackLang: 'en',
      lang: 'en',
    }),

    provideHttpClient(
    withFetch(),
    withInterceptors([ErrorInterceptor , AlertInterceptor])
    ),

    provideRouter(routes , 
    withInMemoryScrolling(scrollConfig),
    withComponentInputBinding()
    ),



]
};
