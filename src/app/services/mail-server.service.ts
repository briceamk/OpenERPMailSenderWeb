import { Injectable } from '@angular/core';
import {catchError, Observable} from "rxjs";
import {ApiResponseModel} from "../models/api-response.model";
import {GlobalService} from "./global.service";
import {PageModel} from "../models/page.model";
import {MailServerModel} from "../models/mail-server.model";

@Injectable({
  providedIn: 'root'
})
export class MailServerService extends GlobalService{

  fetchMailServers$ = (page: number, size: number, direction: string, attribute: string) => <Observable<ApiResponseModel<PageModel<MailServerModel>>>>
    this._http.get<ApiResponseModel<PageModel<MailServerModel>>>
      (`${this.server}/mail-servers`, {
          params: {
            'page': page,
            'size': size,
            'direction': direction,
            'attribute': attribute
          }
        }
      )
      .pipe(
        catchError(this.handleError)
      );

  searchMailServers$ = (page: number, size: number, direction: string, attribute: string, keyword: string) => <Observable<ApiResponseModel<PageModel<MailServerModel>>>>
    this._http.get<ApiResponseModel<PageModel<MailServerModel>>>
    (`${this.server}/mail-servers/search`, {
        params: {
          'page': page,
          'size': size,
          'direction': direction,
          'attribute': attribute,
          'keyword': keyword
        }
      }
    )
      .pipe(
        catchError(this.handleError)
      );

  createMailServer$ = (emailServer: MailServerModel) => <Observable<ApiResponseModel<MailServerModel>>>
    this._http.post<ApiResponseModel<MailServerModel>>
    (`${this.server}/mail-servers`, emailServer)
      .pipe(
        catchError(this.handleError)
      );

  updateMailServer$ = (id: string, emailServer: MailServerModel) => <Observable<ApiResponseModel<MailServerModel>>>
    this._http.put<ApiResponseModel<MailServerModel>>
    (`${this.server}/mail-servers/${id}`, emailServer)
      .pipe(
        catchError(this.handleError)
      );

  fetchMailServerById$ = (id: string) => <Observable<ApiResponseModel<MailServerModel>>>
    this._http.get<ApiResponseModel<MailServerModel>>
    (`${this.server}/mail-servers/${id}`)
      .pipe(
        catchError(this.handleError)
      );

  sendVerificationCode$ = (id: string, username: string, owner: string) => <Observable<ApiResponseModel<MailServerModel>>>
    this._http.put<ApiResponseModel<MailServerModel>>
    (`${this.server}/mail-servers/send-code/${id}`, {email: username, owner})
      .pipe(
        catchError(this.handleError)
      );

  verifyMailServer$ = (id: string, code: string) => <Observable<ApiResponseModel<MailServerModel>>>
    this._http.put<ApiResponseModel<MailServerModel>>
    (`${this.server}/mail-servers/confirm/code/${id}`, {code})
      .pipe(
        catchError(this.handleError)
      );
}
