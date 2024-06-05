import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgFor, NgIf, NgSwitch} from "@angular/common";
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {LoginState} from "../../states/login.state";
import {DataStateEnum} from "../../enums/data-state.enum";
import {UserService} from "../../services/user.service";
import {Router, RouterLink} from "@angular/router";
import {FormsModule, NgForm} from "@angular/forms";
import {ApiResponseModel} from "../../models/api-response.model";
import {ProfileModel} from "../../models/profile.model";
import {KeyEnum} from "../../enums/key.enum";
import {ValidationErrorModel} from "../../models/validation-error.model";
import {LogoComponent} from "../../components/logo/logo.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, FormsModule, AsyncPipe, NgSwitch, NgFor, RouterLink, LogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginState$: Observable<LoginState> = of({dataState: DataStateEnum.Loaded, loggedIn: false});
  emailSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  readonly PageEnum = DataStateEnum;

  constructor(private _userService: UserService, private _router: Router) {}

  ngOnInit(): void {

  }

  login(loginForm: NgForm): void {
    this.loginState$ = this._userService.login$(loginForm.value.email, loginForm.value.password)
      .pipe(
        map((response: ApiResponseModel<ProfileModel>) => {
          console.log(response)
          if(response.data?.user.useMfa) {
            this.emailSubject.next(response.data.user.email);
            loginForm.resetForm();
            return {
              dataState: DataStateEnum.Loaded, loginSuccess: true, useMfa: true, email: response.data.user.email,
              message: response.message, loggedIn: false
            }
          } else {
            localStorage.setItem(KeyEnum.AccessToken, response.data?.accessToken as string);
            localStorage.setItem(KeyEnum.RefreshToken, response.data?.refreshToken as string);
            window.location.href = '/mail-servers';
            return { dataState: DataStateEnum.Loaded, loginSuccess: true, loggedIn: false }
          }
        }),
        startWith({dataState: DataStateEnum.Loading, useMfa: false, loggedIn: false}),
        catchError((error: any) => {
          if(typeof error === "string")
            return of({dataState: DataStateEnum.Error, reason: error, loginSuccess: false, useMfa: false, loggedIn: false});
          else
            return of({dataState: DataStateEnum.Error, error: error as ValidationErrorModel[], loginSuccess: false, useMfa: false, loggedIn: false});
        })
      );
  }

  verifyCode(verifyCodeForm: NgForm): void {
    this.loginState$ = this._userService.verifyCode$(this.emailSubject.value, verifyCodeForm.value.code)
      .pipe(
        map((response: ApiResponseModel<ProfileModel>) => {
            localStorage.setItem(KeyEnum.AccessToken, response.data?.accessToken as string);
            localStorage.setItem(KeyEnum.RefreshToken, response.data?.refreshToken as string);
            verifyCodeForm.resetForm();
            window.location.href = '/mail-servers';
            return { dataState: DataStateEnum.Loaded, loginSuccess: true, message: response.message, loggedIn: false}
          }),
        startWith({dataState: DataStateEnum.Loading, useMfa: true, loginSuccess: false, email: this.emailSubject.value, loggedIn: false}),
        catchError((error: any) => {
          if(typeof error === "string")
            return of({dataState: DataStateEnum.Error, reason: error, loginSuccess: false, useMfa: true, loggedIn: false});
          else
            return of({dataState: DataStateEnum.Error, error: error as ValidationErrorModel[], loginSuccess: false, useMfa: true, loggedIn: false});
        })
      );
  }

  resendCode(): void {
    this.loginState$ = this._userService.resendCode$(this.emailSubject.value)
      .pipe(
        map((response: ApiResponseModel<ProfileModel>) => {
          return {
            dataState: DataStateEnum.Loaded, email: this.emailSubject.value, message: response.message, useMfa: true, loginSuccess: true, loggedIn: false
          }
        }),
        startWith({dataState: DataStateEnum.Loading, useMfa: true, email: this.emailSubject.value, loginSuccess: false, loggedIn: false}),
        catchError((error: any) => {
          if(typeof error === "string" ) {
            return of({
              dataState: DataStateEnum.Error, useMfa: true, loginSuccess: false, email: this.emailSubject.value, reason: error, loggedIn: false
            })
          } else {
            return of({
              dataState: DataStateEnum.Error, useMfa: true, loginSuccess: false, email: this.emailSubject.value, error: error as ValidationErrorModel[], loggedIn: false
            })
          }
        })
      );
  }

  loginAgain(): void {
    this.loginState$ = of({dataState: DataStateEnum.Loaded, loginSuccess: false, loggedIn: false});
    this._router.navigate(['/login']);
  }


}
