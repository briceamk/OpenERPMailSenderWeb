import { Component } from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {AppState} from "../../../states/app.state";
import {MailModel} from "../../../models/mail.model";
import {MailServerModel} from "../../../models/mail-server.model";
import {MailService} from "../../../services/mail.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ValidationErrorModel} from "../../../models/validation-error.model";
import {FormsModule, NgForm} from "@angular/forms";
import { DataStateEnum } from '../../../enums/data-state.enum';
import {AsyncPipe, JsonPipe, NgForOf, NgIf, NgSwitch} from "@angular/common";

@Component({
  selector: 'app-mail-details',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    NgForOf,
    NgIf,
    RouterLink,
    NgSwitch,
    JsonPipe
  ],
  templateUrl: './mail-details.component.html',
  styleUrl: './mail-details.component.css'
})
export class MailDetailsComponent {
  mailState$ : Observable<AppState<MailModel>> = of({dataState: DataStateEnum.Loaded, loggedIn: true});
  mailSubject: BehaviorSubject<MailModel> = new BehaviorSubject<MailModel>(null);
  mailServersSubject: BehaviorSubject<MailServerModel[]> = new BehaviorSubject<MailServerModel[]>(null);
  unlockFormSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  unlockForm$: Observable<boolean> = this.unlockFormSubject.asObservable();
  protected readonly DataStateEnum = DataStateEnum;

  constructor(private _mailService: MailService, private _activateRoute: ActivatedRoute, private _router: Router) {}

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.mailState$ = this._activateRoute.data
      .pipe(
        map((response: any) => {
          this.mailSubject.next(response['mail'].data.data as MailModel);
          this.mailServersSubject.next(response['mailServers'].data.data as MailServerModel[]);
          this.unlockFormSubject.next(false);
          return {
            dataState: DataStateEnum.Loaded,
            loggedIn: true,
            data: response['mail'].data.data as MailModel
          }
        }),
        startWith({dataState: DataStateEnum.Loading, loggedIn: true}),
        catchError((error: any) => {
          if(typeof error.mails === "string") {
            return of({dataState: DataStateEnum.Error, reason: error['mail'], loggedIn: true});
          }else {
            return of({dataState: DataStateEnum.Error, error: error['mail'] as ValidationErrorModel[], loggedIn: true})
          }
        })
      );
  }

  updateMail(mailForm: NgForm): void {
    console.log({...mailForm.value})
    const mail: MailModel = {...mailForm.value};
    mail.mailServer = mailForm.value.mailServer;
    mail.mailTemplate = mailForm.value.mailTemplate;
    this.mailState$ = this._mailService.updateMail$(mail.id, mail)
      .pipe(
        map((response: any) => {
          this.mailSubject.next({...response.data.data} as MailModel);
          this.unlockFormSubject.next(false);
          mailForm.resetForm({...this.mailSubject.value, mailServer: this.mailSubject.value.mailServer.id});
          return {
            dataState: DataStateEnum.Loaded, message: response.message, loggedIn: true, data: this.mailSubject.value
          };
        }),
        startWith({dataState: DataStateEnum.Loading, loggedIn: true, data: this.mailSubject.value}),
        catchError((error: any) => {
          if(typeof error === "string") {
            return of({dataState: DataStateEnum.Error, reason: error, loggedIn: true, data: this.mailSubject.value});
          } else {
            return of({dataState: DataStateEnum.Error, error: error as ValidationErrorModel[], loggedIn: true, data: this.mailSubject.value});
          }
        })
      );
  }

  cancelEditMail(mailForm: NgForm): void {
    mailForm.resetForm({...this.mailSubject.value, mailServer: this.mailSubject.value.mailServer.id});
    this.unlockFormSubject.next(false);

  }

  editMail(): void {
    this.unlockFormSubject.next(true);
  }

}
