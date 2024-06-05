import {Component, OnInit} from '@angular/core';
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {LogoComponent} from "../../components/logo/logo.component";
import {catchError, map, Observable, of, startWith} from "rxjs";
import {ResetPasswordState} from "../../states/reset-password.state";
import {DataStateEnum} from "../../enums/data-state.enum";
import {UserService} from "../../services/user.service";
import {RequestResetPasswordModel} from "../../models/request-reset-password.model";
import {ApiResponseModel} from "../../models/api-response.model";
import {ValidationErrorModel} from "../../models/validation-error.model";
import {AsyncPipe, NgForOf, NgIf, NgSwitch} from "@angular/common";
import {ResetPasswordModel} from "../../models/reset-password.model";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    LogoComponent,
    NgIf,
    AsyncPipe,
    NgSwitch,
    NgForOf
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{

  resetPasswordState$: Observable<ResetPasswordState> = of({dataState: DataStateEnum.Loaded, requestResetPasswordLink: true, loggedIn: false});
  verificationCode: string = "";
  readonly PageEnum = DataStateEnum;

  constructor(private _userService: UserService, private _activateRoute: ActivatedRoute) {}

  ngOnInit() {
    this.verificationCode = this._activateRoute.snapshot.params['verificationCode'];
    if(this.verificationCode) {
      this.resetPasswordState$ = of({dataState: DataStateEnum.Loaded, requestResetPasswordLink: false, loggedIn: false});
    }
  }

  requestResetPassword(requestResetPasswordForm: NgForm): void {
    const requestResetPassword: RequestResetPasswordModel = {
      email: requestResetPasswordForm.value.email
    };

    this.resetPasswordState$ = this._userService.requestResetPassword$(requestResetPassword)
      .pipe(
        map((response: ApiResponseModel<any>) => {
          requestResetPasswordForm.resetForm();
          return {dataState: DataStateEnum.Loaded, message: response.message, requestResetPasswordLink: true, loggedIn: false}
        }),
        startWith({dataState: DataStateEnum.Loading, requestResetPasswordLink: true, loggedIn: false}),
        catchError((error: any) => {
          if(typeof error === "string") {
            return of({dataState: DataStateEnum.Error, reason: error, requestResetPasswordLink: true, loggedIn: false})
          } else {
            return of({dataState: DataStateEnum.Error, error: error as ValidationErrorModel[], requestResetPasswordLink: true, loggedIn: false})
          }
        })
      );
  }

  resetPassword(resetPasswordForm: NgForm): void {
    const resetPassword: ResetPasswordModel = {
      password: resetPasswordForm.value.password,
      confirmPassword: resetPasswordForm.value.confirmPassword
    };

    this.resetPasswordState$ = this._userService.resetPassword$(this.verificationCode, resetPassword)
      .pipe(
        map((response: ApiResponseModel<any>) => {
          resetPasswordForm.resetForm();
          return {dataState: DataStateEnum.Loaded, message: response.message, requestResetPasswordLink: false, loggedIn: false}
        }),
        startWith({dataState: DataStateEnum.Loading, requestResetPasswordLink: false, loggedIn: false}),
        catchError((error: any) => {
          if(typeof error === "string") {
            return of({dataState: DataStateEnum.Error, reason: error, requestResetPasswordLink: false, loggedIn: false})
          } else {
            return of({dataState: DataStateEnum.Error, error: error as ValidationErrorModel[], requestResetPasswordLink: false, loggedIn: false})
          }
        })
      );
  }


}
