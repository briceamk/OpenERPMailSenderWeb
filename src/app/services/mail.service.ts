import { Injectable } from '@angular/core';
import {GlobalService} from "./global.service";
import {catchError, Observable} from "rxjs";
import {ApiResponseModel} from "../models/api-response.model";
import {PageModel} from "../models/page.model";
import {MailModel} from "../models/mail.model";

@Injectable({
  providedIn: 'root'
})
export class MailService extends GlobalService{

  fetchMails$ = (page: number, size: number, direction: string, attribute: string) => <Observable<ApiResponseModel<PageModel<MailModel>>>>
    this._http.get<ApiResponseModel<PageModel<MailModel>>>
    (`${this.server}/mails`, {
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

  searchMails$ = (page: number, size: number, direction: string, attribute: string, keyword: string) => <Observable<ApiResponseModel<PageModel<MailModel>>>>
    this._http.get<ApiResponseModel<PageModel<MailModel>>>
      (`${this.server}/mails/search`, {
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

  fetchMailById = (id: string) => <Observable<ApiResponseModel<MailModel>>>
    this._http.get<ApiResponseModel<MailModel>>
    (`${this.server}/mails/${id}`
    )
      .pipe(
        catchError(this.handleError)
      );

  updateMail$ = (id: string, mail: MailModel) => <Observable<ApiResponseModel<MailModel>>>
    this._http.put<ApiResponseModel<MailModel>>
    (`${this.server}/mails/${id}`, mail
    )
      .pipe(
        catchError(this.handleError)
      );
}
