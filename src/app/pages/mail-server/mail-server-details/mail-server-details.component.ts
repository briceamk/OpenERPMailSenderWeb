import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf, NgSwitch} from "@angular/common";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DataStateEnum} from "../../../enums/data-state.enum";
import {BehaviorSubject, catchError, map, Observable, of, sample, startWith, tap} from "rxjs";
import {AppState} from "../../../states/app.state";
import {ApiResponseModel} from "../../../models/api-response.model";
import {MailServerModel} from "../../../models/mail-server.model";
import {MailServerService} from "../../../services/mail-server.service";
import {ValidationErrorModel} from "../../../models/validation-error.model";
import {ServerStatusEnum} from "../../../enums/server-status.enum";

@Component({
  selector: 'app-mail-server-details',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    NgSwitch
  ],
  templateUrl: './mail-server-details.component.html',
  styleUrl: './mail-server-details.component.css'
})
export class MailServerDetailsComponent implements OnInit{

  emailServerState$ : Observable<AppState<MailServerModel>> = of({dataState: DataStateEnum.Loaded, loggedIn: true});
  emailServerSubject: BehaviorSubject<MailServerModel> = new BehaviorSubject<MailServerModel>(null);
  unlockFormSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  unlockForm$: Observable<boolean> = this.unlockFormSubject.asObservable();
  protected readonly DataStateEnum = DataStateEnum;

  constructor(private _emailServerService: MailServerService, private _activateRoute: ActivatedRoute, private _router: Router) {}

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.emailServerState$ = this._activateRoute.data
      .pipe(
        map((response: any) => {
          this.emailServerSubject.next(response['mailServer'].data.data as MailServerModel);
          this.unlockFormSubject.next(false);
          return {
            dataState: DataStateEnum.Loaded,
            loggedIn: true,
            data: response['mailServer'].data.data as MailServerModel
          }
        }),
        startWith({dataState: DataStateEnum.Loading, loggedIn: true}),
        catchError((error: any) => {
          if(typeof error.emailServers === "string") {
            return of({dataState: DataStateEnum.Error, reason: error['mailServer'], loggedIn: true});
          }else {
            return of({dataState: DataStateEnum.Error, error: error['mailServer'] as ValidationErrorModel[], loggedIn: true})
          }
        })
      );
  }

  updateEmailServer(emailServerForm: NgForm): void {
    const emailServer: MailServerModel = {...emailServerForm.value};
    this.emailServerState$ = this._emailServerService.updateMailServer$(emailServer.id, emailServer)
      .pipe(
        map((response: any) => {
          this.emailServerSubject.next({...response.data.data} as MailServerModel);
          this.unlockFormSubject.next(false);
          emailServerForm.resetForm({...this.emailServerSubject.value});
          return {
            dataState: DataStateEnum.Loaded, message: response.message, loggedIn: true, data: this.emailServerSubject.value
          };
        }),
        startWith({dataState: DataStateEnum.Loading, loggedIn: true, data: this.emailServerSubject.value}),
        catchError((error: any) => {
          if(typeof error === "string") {
            return of({dataState: DataStateEnum.Error, reason: error, loggedIn: true, data: this.emailServerSubject.value});
          } else {
            return of({dataState: DataStateEnum.Error, error: error as ValidationErrorModel[], loggedIn: true, data: this.emailServerSubject.value});
          }
        })
      );
  }

  cancelEditEmailServer(emailServerForm: NgForm): void {
    emailServerForm.resetForm({...this.emailServerSubject.value})
    this.unlockFormSubject.next(false);

  }

  editEmailServer(): void {
    this.unlockFormSubject.next(true);
  }

  createEmailServer(): void {
    this._router.navigate(['/mail-servers/new']);
  }

  sendVerificationCode(emailServerForm: NgForm): void {
    let {id, username, name}: any = {...this.emailServerSubject.value};

    this.emailServerState$ = this._emailServerService.sendVerificationCode$(id, username, name)
      .pipe(
        map((response: any) => {
          this.emailServerSubject.next({...response.data.data} as MailServerModel);
          this.unlockFormSubject.next(false);
          emailServerForm.resetForm({...this.emailServerSubject.value});
          return {
            dataState: DataStateEnum.Loaded, message: response.message, loggedIn: true, data: this.emailServerSubject.value
          };
        }),
        startWith({dataState: DataStateEnum.Loading, loggedIn: true, data: this.emailServerSubject.value}),
        catchError((error: any) => {
          if(typeof error === "string") {
            return of({dataState: DataStateEnum.Error, reason: error, loggedIn: true, data: this.emailServerSubject.value});
          } else {
            return of({dataState: DataStateEnum.Error, error: error as ValidationErrorModel[], loggedIn: true, data: this.emailServerSubject.value});
          }
        })
      );
  }


  verifyCode(emailServerForm: NgForm): void {

    this.emailServerState$ = this._emailServerService.verifyMailServer$(this.emailServerSubject.value.id, emailServerForm.value.code)
      .pipe(
        map((response: any) => {
          this.emailServerSubject.next({...response.data.data} as MailServerModel);
          this.unlockFormSubject.next(false);
          emailServerForm.resetForm({...this.emailServerSubject.value});
          return {
            dataState: DataStateEnum.Loaded, message: response.message, loggedIn: true, data: this.emailServerSubject.value
          };
        }),
        startWith({dataState: DataStateEnum.Loading, loggedIn: true, data: this.emailServerSubject.value}),
        catchError((error: any) => {
          if(typeof error === "string") {
            return of({dataState: DataStateEnum.Error, reason: error, loggedIn: true, data: this.emailServerSubject.value});
          } else {
            return of({dataState: DataStateEnum.Error, error: error as ValidationErrorModel[], loggedIn: true, data: this.emailServerSubject.value});
          }
        })
      );
  }
}
