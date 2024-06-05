import { Injectable } from '@angular/core';
import {catchError, Observable} from "rxjs";
import {ApiResponseModel} from "../models/api-response.model";
import {PageModel} from "../models/page.model";
import {MailHistoryModel} from "../models/mail-history.model";
import {GlobalService} from "./global.service";

@Injectable({
  providedIn: 'root'
})
export class MailHistoryService extends GlobalService{

  fetchMailHistories$ = (page: number, size: number, direction: string, attribute: string) => <Observable<ApiResponseModel<PageModel<MailHistoryModel>>>>
    this._http.get<ApiResponseModel<PageModel<MailHistoryModel>>>
    (`${this.server}/mail-histories`, {
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

  searchMailHistories$ = (page: number, size: number, direction: string, attribute: string, keyword: string) => <Observable<ApiResponseModel<PageModel<MailHistoryModel>>>>
    this._http.get<ApiResponseModel<PageModel<MailHistoryModel>>>
    (`${this.server}/mail-histories/search`, {
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
}
