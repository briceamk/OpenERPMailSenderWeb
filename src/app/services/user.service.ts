import { Injectable } from '@angular/core';
import {catchError, Observable, tap} from "rxjs";
import {ApiResponseModel} from "../models/api-response.model";
import {ProfileModel} from "../models/profile.model";
import {RegisterModel} from "../models/register.model";
import {UserModel} from "../models/user.model";
import {RequestResetPasswordModel} from "../models/request-reset-password.model";
import {ResetPasswordModel} from "../models/reset-password.model";
import {GlobalService} from "./global.service";
import {KeyEnum} from "../enums/key.enum";
import {TOKEN_PREFIX} from "../constants/app.contant";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class UserService extends GlobalService{

  private _jwtHelper:JwtHelperService = new JwtHelperService();

  login$ = (email: string, password: string) => <Observable<ApiResponseModel<ProfileModel>>>
    this._http.post<ApiResponseModel<ProfileModel>>
      (`${this.server}/users/login`, {email, password})
      .pipe(
        catchError(this.handleError)
      );

  verifyCode$ = (email: string, code: string) => <Observable<ApiResponseModel<ProfileModel>>>
    this._http.get<ApiResponseModel<ProfileModel>>
    (`${this.server}/users/verify/mfa/${email}/${code}` )
      .pipe(
        catchError(this.handleError)
      );
  resendCode$ = (email: string) => <Observable<ApiResponseModel<ProfileModel>>>
    this._http.get<ApiResponseModel<ProfileModel>>
    (`${this.server}/users/resend/mfa/code/${email}` )
      .pipe(
        catchError(this.handleError)
      );

  register$ = (register: RegisterModel) => <Observable<ApiResponseModel<UserModel>>>
    this._http.post<ApiResponseModel<UserModel>>
    (`${this.server}/users/register`, register)
      .pipe(
        catchError(this.handleError)
      );

  requestResetPassword$ = (requestResetPassword: RequestResetPasswordModel) => <Observable<ApiResponseModel<any>>>
    this._http.post(`${this.server}/users/reset-password/request-link`, requestResetPassword)
      .pipe(
        catchError(this.handleError)
      );

  resetPassword$ = (code: string, resetPassword: ResetPasswordModel) => <Observable<ApiResponseModel<any>>>
    this._http.put(`${this.server}/users/verify/password/${code}`, resetPassword)
      .pipe(
        catchError(this.handleError)
      );

  activateAccount$ = (code: string) => <Observable<ApiResponseModel<any>>>
    this._http.get(`${this.server}/users/activate/account/${code}`)
      .pipe(
        catchError(this.handleError)
      );

  isAuthenticated = (token: string): boolean => (this._jwtHelper.decodeToken<string>(token)
    && !this._jwtHelper.isTokenExpired(localStorage.getItem(KeyEnum.AccessToken)));


  decodedToken = (token: string): boolean => this._jwtHelper.decodeToken(token);

  refreshToken$ = (token: string) => <Observable<ApiResponseModel<ProfileModel>>>
    this._http.get(`${this.server}/users/refresh/token`, {headers: {Authorization: `${TOKEN_PREFIX}${token}`}})
      .pipe(
        tap( (response: ApiResponseModel<ProfileModel>) => {
          localStorage.removeItem(KeyEnum.AccessToken);
          localStorage.removeItem(KeyEnum.RefreshToken);
          localStorage.setItem(KeyEnum.AccessToken, response.data.accessToken);
          localStorage.setItem(KeyEnum.RefreshToken, response.data.refreshToken);
        }),
        catchError(this.handleError)
      );

  fetchUserById$ = (id: string) => <Observable<ApiResponseModel<UserModel>>>
    this._http.get(`${this.server}/users/${id}`)
      .pipe(
        catchError(this.handleError)
      );
}
