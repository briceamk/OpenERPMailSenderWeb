import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {LogoComponent} from "../../components/logo/logo.component";
import {catchError, map, Observable, of, startWith} from "rxjs";
import {AppState} from "../../states/app.state";
import {DataStateEnum} from "../../enums/data-state.enum";
import {ApiResponseModel} from "../../models/api-response.model";
import {AsyncPipe, NgIf, NgSwitch} from "@angular/common";

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [
    RouterLink,
    LogoComponent,
    NgIf,
    AsyncPipe,
    NgSwitch
  ],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.css'
})
export class ActivateAccountComponent implements OnInit{

  activateAccountState$: Observable<AppState<any>> = of({dataState: DataStateEnum.Loaded, loggedIn: false});

  constructor(private _activatedRouter: ActivatedRoute) {
  }

  ngOnInit(): void {
    console.log()
    this.activateAccountState$ = this._activatedRouter.data.pipe(
      map((response: any) => {
        return {
          dataState: DataStateEnum.Loaded, loggedIn: false, message: response['activateAccount'].message
        }
      }),
      startWith({dataState: DataStateEnum.Loading, loggedIn: false}),
      catchError((error: any) => {

          return of({dataState: DataStateEnum.Error, loggedIn: false, reason: error['activateAccount']})
      })
    );
  }

  protected readonly DataStateEnum = DataStateEnum;
}
