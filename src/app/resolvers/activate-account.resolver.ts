import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {MailServerService} from "../services/mail-server.service";
import {Observable} from "rxjs";
import {ApiResponseModel} from "../models/api-response.model";
import {DEFAULT_PAGINATOR_DIRECTION, DEFAULT_PAGINATOR_PAGE, DEFAULT_PAGINATOR_SIZE} from "../constants/app.contant";
import {MailServerModel} from "../models/mail-server.model";
import {PageModel} from "../models/page.model";
import {UserService} from "../services/user.service";

export const activateAccountResolver: ResolveFn<ApiResponseModel<any>> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApiResponseModel<any>> => {
  return inject(UserService).activateAccount$(route.params['verificationCode']);
};
