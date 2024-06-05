import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {MailServerService} from "../services/mail-server.service";
import {Observable} from "rxjs";
import {ApiResponseModel} from "../models/api-response.model";
import {DEFAULT_PAGINATOR_DIRECTION, DEFAULT_PAGINATOR_PAGE, DEFAULT_PAGINATOR_SIZE} from "../constants/app.contant";
import {MailServerModel} from "../models/mail-server.model";
import {PageModel} from "../models/page.model";

export const fetchMailServersResolver: ResolveFn<ApiResponseModel<PageModel<MailServerModel>>> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApiResponseModel<PageModel<MailServerModel>>> => {
  return inject(MailServerService).fetchMailServers$(
    DEFAULT_PAGINATOR_PAGE,
    DEFAULT_PAGINATOR_SIZE,
    DEFAULT_PAGINATOR_DIRECTION,
    "name"
  );
};

export const fetchMailServerByIdResolver: ResolveFn<ApiResponseModel<MailServerModel>> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApiResponseModel<MailServerModel>> => {
  return inject(MailServerService).fetchMailServerById$(route.params['id']);
};

