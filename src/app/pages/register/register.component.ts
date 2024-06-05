import {Component} from '@angular/core';
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {LogoComponent} from "../../components/logo/logo.component";
import {catchError, map, Observable, of, startWith} from "rxjs";
import {DataStateEnum} from "../../enums/data-state.enum";
import {UserService} from "../../services/user.service";
import {RegisterModel} from "../../models/register.model";
import {ValidationErrorModel} from "../../models/validation-error.model";
import {ApiResponseModel} from "../../models/api-response.model";
import {UserModel} from "../../models/user.model";
import {AsyncPipe, NgForOf, NgIf, NgSwitch} from "@angular/common";
import {AppState} from "../../states/app.state";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    LogoComponent,
    AsyncPipe,
    NgSwitch,
    NgIf,
    NgForOf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerState$: Observable<AppState<any>> = of({dataState: DataStateEnum.Loaded, loggedIn: false});

  constructor(private _userService: UserService) {}


  register(registerForm: NgForm): void {
    const register: RegisterModel = {
      firstName: registerForm.value.firstName,
      lastName: registerForm.value.lastName,
      email: registerForm.value.email,
      password: registerForm.value.password,
      confirmPassword: registerForm.value.confirmPassword,
      useMfa: registerForm.value.useMfa,
    }
    this.registerState$ = this._userService.register$(register)
      .pipe(
        map((response: ApiResponseModel<UserModel>) => {
          registerForm.resetForm();
          return { dataState: DataStateEnum.Loaded, message: response.message, loggedIn: false}
        }),
        startWith({dataState: DataStateEnum.Loading, loggedIn: false}),
        catchError((error: any) => {
          if(typeof error === "string") {
            return of({dataState: DataStateEnum.Error, reason: error, loggedIn: false})
          } else {
            return of({dataState: DataStateEnum.Error, error: error as ValidationErrorModel[], loggedIn: false})
          }
        })
      );
  }

  protected readonly PageEnum = DataStateEnum;
}
