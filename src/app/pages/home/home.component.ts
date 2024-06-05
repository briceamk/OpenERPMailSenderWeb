import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {AppState} from "../../states/app.state";
import {DataStateEnum} from "../../enums/data-state.enum";
import {AsyncPipe, NgIf} from "@angular/common";
import {KeyEnum} from "../../enums/key.enum";
import {MailServersComponent} from "../mail-server/mail-servers/mail-servers.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    MailServersComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  homeState$ : Observable<AppState<any>> = of({dataState: DataStateEnum.Loaded, loggedIn: false});

  constructor() {}

  ngOnInit(): void {
    this.homeState$ = of({dataState: DataStateEnum.Loaded, loggedIn: this.isLoggedIn()});
  }

  isLoggedIn(): boolean {
    //TODO to optimize by check if token is valid or not
    return !!localStorage.getItem(KeyEnum.AccessToken);

  }
}
