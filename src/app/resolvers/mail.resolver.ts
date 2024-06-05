import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {inject} from "@angular/core";
import {MailService} from "../services/mail.service";
import {DEFAULT_PAGINATOR_DIRECTION, DEFAULT_PAGINATOR_PAGE, DEFAULT_PAGINATOR_SIZE} from "../constants/app.contant";
import {ApiResponseModel} from "../models/api-response.model";
import {PageModel} from "../models/page.model";
import {MailModel} from "../models/mail.model";
import {Observable} from "rxjs";

export const fetchMailsResolver: ResolveFn<ApiResponseModel<PageModel<MailModel>>> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApiResponseModel<PageModel<MailModel>>> => {
  return inject(MailService).fetchMails$(
    DEFAULT_PAGINATOR_PAGE,
    DEFAULT_PAGINATOR_SIZE,
    DEFAULT_PAGINATOR_DIRECTION,
    "createdAt"
  );
};

export const fetchMailBydIdResolver: ResolveFn<ApiResponseModel<MailModel>> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApiResponseModel<MailModel>> => {
  return inject(MailService).fetchMailById(route.params['id']);
};
