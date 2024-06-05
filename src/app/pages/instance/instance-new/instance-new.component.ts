import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {AppState} from "../../../states/app.state";
import {InstanceModel} from "../../../models/instance.model";
import {DataStateEnum} from '../../../enums/data-state.enum';
import {InstanceService} from "../../../services/instance.service";
import {MailServerModel} from "../../../models/mail-server.model";
import {PageModel} from "../../../models/page.model";
import {ValidationErrorModel} from "../../../models/validation-error.model";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FormsModule, NgForm} from "@angular/forms";
import {ApiResponseModel} from "../../../models/api-response.model";
import {AsyncPipe, NgForOf, NgIf, NgSwitch} from "@angular/common";

@Component({
  selector: 'app-instance-new',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    NgForOf,
    NgIf,
    RouterLink,
    NgSwitch
  ],
  templateUrl: './instance-new.component.html',
  styleUrl: './instance-new.component.css'
})
export class InstanceNewComponent implements OnInit{
  instanceState$ : Observable<AppState<InstanceModel>> = of({dataState: DataStateEnum.Loaded, loggedIn: true});
  mailServersSubject: BehaviorSubject<MailServerModel[]> = new BehaviorSubject<MailServerModel[]>(null);
  protected readonly DataStateEnum = DataStateEnum;

  constructor(private _instanceService: InstanceService, private _activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.instanceState$ = this._activatedRoute.data
      .pipe(
        map((response: any) => {
          this.mailServersSubject.next(response['mailServers'].data.data as MailServerModel[]);
          console.log(this.mailServersSubject.value)
          return {
            dataState: DataStateEnum.Loaded,
            loggedIn: true,
          }
        }),
        startWith({dataState: DataStateEnum.Loading, loggedIn: true}),
        catchError((error: any) => {
          if(typeof error.emailServers === "string") {
            return of({dataState: DataStateEnum.Error, reason: error['mailServers'], loggedIn: true});
          }else {
            return of({dataState: DataStateEnum.Error, error: error['mailServers'] as ValidationErrorModel[], loggedIn: true})
          }
        })
      );
  }

  newInstance(instanceForm: NgForm): void {
    const instance: InstanceModel = {...instanceForm.value};
    instance.mailServer = this.mailServersSubject.value
                              .filter((ms: MailServerModel) => ms.id === instanceForm.value.mailServer)[0];
    this.instanceState$ = this._instanceService.createInstance$(instance)
      .pipe(
        map((response: ApiResponseModel<InstanceModel>) => {
          instanceForm.resetForm({state: 'ACTIVE'});
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


  cancelInstance(instanceForm: NgForm): void {

  }
}
