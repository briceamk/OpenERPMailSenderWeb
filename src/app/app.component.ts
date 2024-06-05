import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from "./components/navbar/navbar.component";
import {HomeComponent} from "./pages/home/home.component";
import {map, Observable, of, switchMap} from "rxjs";
import {AppState} from "./states/app.state";
import {DataStateEnum} from "./enums/data-state.enum";
import {KeyEnum} from "./enums/key.enum";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {UserService} from "./services/user.service";
import {UserModel} from "./models/user.model";
import {ProfileModel} from "./models/profile.model";
import {RoleModel} from "./models/role.model";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, HomeComponent, NgIf, NgClass, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'OpenERPEmailSenderWeb';
  appState$ : Observable<AppState<any>> = of({dataState: DataStateEnum.Loaded, loggedIn: false});
  profile$: Observable<ProfileModel> = of(null);

  constructor(private _userService: UserService) {}

  ngOnInit(): void {
    this.appState$ = of({dataState: DataStateEnum.Loaded, loggedIn: this.isLoggedIn()});
    const accessToken: string = localStorage.getItem(KeyEnum.AccessToken);
    if(accessToken) {
      this.profile$ = of(this._userService.decodedToken(accessToken))
        .pipe(
          (
            switchMap((tokenData: any) => this._userService.fetchUserById$(tokenData.sub)
              .pipe(
                map(((response: any) => {
                    return {
                      user: response.data?.user as UserModel,
                      roles: response.data?.roles as RoleModel[],
                      accessToken: accessToken,
                      refreshToken: localStorage.getItem(KeyEnum.RefreshToken),
                    };
                  })
                )
              )
            )
          )
        );
    }

  }

  isLoggedIn(): boolean {
    //TODO to optimize by check if token is valid or not
    return !!localStorage.getItem(KeyEnum.AccessToken) && this._userService.isAuthenticated(localStorage.getItem(KeyEnum.AccessToken));

  }

  onLogout(): void {
    localStorage.removeItem(KeyEnum.AccessToken);
    localStorage.removeItem(KeyEnum.RefreshToken);
    window.location.href = '/login';
  }
}
