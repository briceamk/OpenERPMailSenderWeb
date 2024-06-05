import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {ApiResponseModel} from "../models/api-response.model";
import {PageModel} from "../models/page.model";
import {inject} from "@angular/core";
import {DEFAULT_PAGINATOR_DIRECTION, DEFAULT_PAGINATOR_PAGE, DEFAULT_PAGINATOR_SIZE} from "../constants/app.contant";
import {MailHistoryModel} from "../models/mail-history.model";
import {MailHistoryService} from "../services/mail-history.service";
import {Observable} from "rxjs";

export const fetchMailHistoriesResolver: ResolveFn<ApiResponseModel<PageModel<MailHistoryModel>>> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApiResponseModel<PageModel<MailHistoryModel>>> => {
  return inject(MailHistoryService).fetchMailHistories$(
    DEFAULT_PAGINATOR_PAGE,
    DEFAULT_PAGINATOR_SIZE,
    DEFAULT_PAGINATOR_DIRECTION,
    "createdAt"
  );
};
