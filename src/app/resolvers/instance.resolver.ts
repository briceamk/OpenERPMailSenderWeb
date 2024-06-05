import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {ApiResponseModel} from "../models/api-response.model";
import {InstanceModel} from "../models/instance.model";
import {Observable} from "rxjs";
import {inject} from "@angular/core";
import {InstanceService} from "../services/instance.service";
import {DEFAULT_PAGINATOR_DIRECTION, DEFAULT_PAGINATOR_PAGE, DEFAULT_PAGINATOR_SIZE} from "../constants/app.contant";
import {PageModel} from "../models/page.model";

export const fetchInstancesResolver: ResolveFn<ApiResponseModel<PageModel<InstanceModel>>> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApiResponseModel<PageModel<InstanceModel>>> => {
  return inject(InstanceService).fetchInstances$(
    DEFAULT_PAGINATOR_PAGE,
    DEFAULT_PAGINATOR_SIZE,
    DEFAULT_PAGINATOR_DIRECTION,
    "host"
  );
};


export const fetchInstanceResolver: ResolveFn<ApiResponseModel<InstanceModel>> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApiResponseModel<InstanceModel>> => {
  return inject(InstanceService).fetchInstancesById$(route.params['id']);
};
