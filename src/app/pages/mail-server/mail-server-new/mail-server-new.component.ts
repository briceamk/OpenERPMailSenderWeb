import { Component } from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {DataStateEnum} from "../../../enums/data-state.enum";
import {Router, RouterLink} from "@angular/router";
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {ApiResponseModel} from "../../../models/api-response.model";
import {MailServerModel} from "../../../models/mail-server.model";
import {AppState} from "../../../states/app.state";
import {AsyncPipe, NgFor, NgForOf, NgIf, NgSwitch} from "@angular/common";
import {MailServerService} from "../../../services/mail-server.service";
import {ValidationErrorModel} from "../../../models/validation-error.model";

@Component({
  selector: 'app-mail-server-new',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    AsyncPipe,
    NgSwitch,
    NgIf,
    NgForOf
  ],
  templateUrl: './mail-server-new.component.html',
  styleUrl: './mail-server-new.component.css'
})
export class MailServerNewComponent {

  emailServerState$ : Observable<AppState<MailServerModel>> = of({dataState: DataStateEnum.Loaded, loggedIn: true});
  protected readonly DataStateEnum = DataStateEnum;

  constructor(private _emailServerService: MailServerService, private _router: Router) {}


  newEmailServer(emailServerForm: NgForm): void {
    const emailServer: MailServerModel = {...emailServerForm.value};
    this.emailServerState$ = this._emailServerService.createMailServer$(emailServer)
      .pipe(
        map((response: ApiResponseModel<MailServerModel>) => {
          emailServerForm.resetForm({state: 'New'});
          //this._router.navigate([`/mail-servers/${response.data.id}`])
          return {
            dataState: DataStateEnum.Loaded, message: response.message, loggedIn: true, data: response.data
          };
        }),
        startWith({dataState: DataStateEnum.Loading, loggedIn: true}),
        catchError((error: any) => {
          if(typeof error === "string") {
            return of({dataState: DataStateEnum.Error, reason: error, loggedIn: true});
          } else {
            return of({dataState: DataStateEnum.Error, error: error as ValidationErrorModel[], loggedIn: true});
          }
        })
      );
  }

  cancelNewInvoice(emailServerForm: NgForm): void {
    emailServerForm.resetForm({state: 'New'});
    this.emailServerState$ =  of({dataState: DataStateEnum.Loaded, loggedIn: true});

  }


}
