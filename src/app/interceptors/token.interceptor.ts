import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {KeyEnum} from "../enums/key.enum";
import {BehaviorSubject, catchError, EMPTY, Observable, switchMap, throwError} from "rxjs";
import {TOKEN_PREFIX} from "../constants/app.contant";
import {inject} from "@angular/core";
import {UserService} from "../services/user.service";
import {ApiResponseModel} from "../models/api-response.model";
import {ProfileModel} from "../models/profile.model";
import {Router} from "@angular/router";

export const tokenInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>>  => {
  const _userService: UserService = inject(UserService);

  let isTokenRefreshing: boolean = false;
  let refreshTokenSubject: BehaviorSubject<ApiResponseModel<ProfileModel>> =
    new BehaviorSubject<ApiResponseModel<ProfileModel>>(null);

  /*const addTokenToHeader = (request: HttpRequest<unknown>, token: string): HttpRequest<unknown> => {
      return request.clone({setHeaders: {Authorization: `${TOKEN_PREFIX}${token}`}});
  }

  const handleRefreshToken = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>>  => {

    if(!isTokenRefreshing) {
      isTokenRefreshing = true;
      refreshTokenSubject.next(null);
      return _userService.refreshToken$(localStorage.getItem(KeyEnum.RefreshToken))
        .pipe(
          switchMap((response: ApiResponseModel<ProfileModel>) => {
            isTokenRefreshing = false;
            refreshTokenSubject.next(response);
            return next(addTokenToHeader(request, localStorage.getItem(KeyEnum.AccessToken)))
          }),
          catchError((error) => {
            isTokenRefreshing = false;
            return throwError(() => error);
          })
        );
    }
    return refreshTokenSubject.pipe(
      switchMap((response: ApiResponseModel<ProfileModel>) => {
        return next(addTokenToHeader(request, localStorage.getItem(KeyEnum.AccessToken)))
      })
    );
  };
  let requestUrlContainsALeastOfOneWhiteListKeyword: boolean = request.url.includes('login')
          || request.url.includes('register')
          || request.url.includes('activate')
          || request.url.includes('verify')
          || request.url.includes('reset-password')
          || request.url.includes('mfa');
  if(requestUrlContainsALeastOfOneWhiteListKeyword) {
    return next(request)
  }
  if(request.headers.get('Authorization')) {
    console.log(' Inside has Auhtorization')
    return next(request);
  } else {
    console.log(' Inside not has token')
    return next(addTokenToHeader(request, localStorage.getItem(KeyEnum.AccessToken)))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('jkdcozeoeociecoe')
          console.log(error.status)
          //if(error instanceof HttpErrorResponse && error.status === 401 && (!error.error.path.includes('refresh/token'))) {
          if(error instanceof HttpErrorResponse && error.status === 401) {
            return handleRefreshToken(request, next);
          } /!*else {
              if (error instanceof HttpErrorResponse && error.status === 401 && (error.error.path.includes('refresh/token'))) {
                console.log(error);
                console.log("logout now....")
                  localStorage.removeItem(KeyEnum.AccessToken);
                  localStorage.removeItem(KeyEnum.RefreshToken);
                  _router.navigate(['/login']);
                  return EMPTY;
              }
              return throwError(() => error);
          }*!/
          return throwError(() => error);
        })
      );
  }
*/

  const addTokenToHeader = (request: HttpRequest<unknown>, token: string): HttpRequest<unknown> => {
    return request.clone({setHeaders: {Authorization: `${TOKEN_PREFIX}${token}`}});
  }

  const handle401Error = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    if(!isTokenRefreshing) {
      isTokenRefreshing = true;
      refreshTokenSubject.next(null);
      return _userService.refreshToken$(localStorage.getItem(KeyEnum.RefreshToken))
        .pipe(
          switchMap((profile: ApiResponseModel<ProfileModel>) => {
            isTokenRefreshing = false;
            refreshTokenSubject.next(profile);
            return next(addTokenToHeader(request, profile.data.accessToken));
          }),
          catchError((error: HttpErrorResponse) => {
            isTokenRefreshing = false;
            window.localStorage.clear();
            window.location.href = '/login';
            return throwError(() => error);
          })
        );
    }
  }

  let requestUrlContainsALeastOfOneWhiteListKeyword: boolean = request.url.includes('login')
    || request.url.includes('register')
    || request.url.includes('activate')
    || request.url.includes('verify')
    || request.url.includes('reset-password')
    || request.url.includes('mfa');
  if(!requestUrlContainsALeastOfOneWhiteListKeyword) {
    request = addTokenToHeader(request, localStorage.getItem(KeyEnum.AccessToken));
  }
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if(error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(request, next);
      }
      return throwError(() => error);

    })
  )
}



