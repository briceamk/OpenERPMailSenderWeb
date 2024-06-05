import { Injectable } from '@angular/core';
import {catchError, Observable} from "rxjs";
import {ApiResponseModel} from "../models/api-response.model";
import {PageModel} from "../models/page.model";
import {GlobalService} from "./global.service";
import {InstanceModel} from "../models/instance.model";

@Injectable({
  providedIn: 'root'
})
export class InstanceService extends GlobalService{

  fetchInstances$ = (page: number, size: number, direction: string, attribute: string) => <Observable<ApiResponseModel<PageModel<InstanceModel>>>>
    this._http.get<ApiResponseModel<PageModel<InstanceModel>>>
    (`${this.server}/instances`, {
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

  search$ = (page: number, size: number, direction: string, attribute: string, keyword: string) => <Observable<ApiResponseModel<PageModel<InstanceModel>>>>
    this._http.get<ApiResponseModel<PageModel<InstanceModel>>>
    (`${this.server}/instances`, {
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

  fetchInstancesById$ = (id: string) => <Observable<ApiResponseModel<InstanceModel>>>
    this._http.get<ApiResponseModel<InstanceModel>>
    (`${this.server}/instances/${id}`,
    )
      .pipe(
        catchError(this.handleError)
      );

  createInstance$ = (instance: InstanceModel) => <Observable<ApiResponseModel<InstanceModel>>>
    this._http.post<ApiResponseModel<InstanceModel>>
    (`${this.server}/instances`, instance
    )
      .pipe(
        catchError(this.handleError)
      );

  updateInstance$ = (id: string, instance: InstanceModel) => <Observable<ApiResponseModel<InstanceModel>>>
    this._http.put<ApiResponseModel<InstanceModel>>
    (`${this.server}/instances/${id}`, instance
    )
      .pipe(
        catchError(this.handleError)
      );

  activateInstance$ = (id: string) => <Observable<ApiResponseModel<InstanceModel>>>
    this._http.put<ApiResponseModel<InstanceModel>>
    (`${this.server}/instances/active/${id}`,{}
    )
      .pipe(
        catchError(this.handleError)
      );

  inactivateInstance$ = (id: string) => <Observable<ApiResponseModel<InstanceModel>>>
    this._http.put<ApiResponseModel<InstanceModel>>
    (`${this.server}/instances/inactive/${id}`,{}
    )
      .pipe(
        catchError(this.handleError)
      );
}
