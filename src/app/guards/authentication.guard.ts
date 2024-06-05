import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from '@angular/router';
import {inject} from "@angular/core";
import {UserService} from "../services/user.service";
import {KeyEnum} from "../enums/key.enum";

export const authenticationGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  => {
  let _userService: UserService = inject(UserService);
  const isAuthenticated = (token: string): boolean => {
    /*if(_userService.isAuthenticated(token)) {
      return true;
    } else {
      window.localStorage.clear();
      window.location.href = '/login';
      return false;
    }*/
    return _userService.isAuthenticated(token);
  }
  return isAuthenticated(localStorage.getItem(KeyEnum.AccessToken));
};
