import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {tokenInterceptor} from "./interceptors/token.interceptor";
import {provideAnimations} from "@angular/platform-browser/animations";
import {JwtModule} from "@auth0/angular-jwt";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([tokenInterceptor]),
      withFetch()
    ),
    provideAnimations(),
    provideRouter(routes),
    importProvidersFrom(
      JwtModule.forRoot({})
    )
  ]
};
