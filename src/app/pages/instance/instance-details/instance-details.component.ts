import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith, tap} from "rxjs";
import {AppState} from "../../../states/app.state";
import {InstanceModel} from "../../../models/instance.model";
import {InstanceService} from "../../../services/instance.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ValidationErrorModel} from "../../../models/validation-error.model";
import {FormsModule, NgForm} from "@angular/forms";
import { DataStateEnum } from '../../../enums/data-state.enum';
import {PageModel} from "../../../models/page.model";
import {MailServerModel} from "../../../models/mail-server.model";
import {AsyncPipe, NgForOf, NgIf, NgSwitch} from "@angular/common";
import {InstanceStateEnum} from "../../../enums/instance-state.enum";

@Component({
  selector: 'app-instance-details',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    FormsModule,
    NgForOf,
    RouterLink,
    NgSwitch
  ],
  templateUrl: './instance-details.component.html',
  styleUrl: './instance-details.component.css'
})
export class InstanceDetailsComponent implements OnInit{
  instanceState$ : Observable<AppState<InstanceModel>> = of({dataState: DataStateEnum.Loaded, loggedIn: true});
  instanceSubject: BehaviorSubject<InstanceModel> = new BehaviorSubject<InstanceModel>(null);
  mailServersSubject: BehaviorSubject<MailServerModel[]> = new BehaviorSubject<MailServerModel[]>(null);
  unlockFormSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  unlockForm$: Observable<boolean> = this.unlockFormSubject.asObservable();
  protected readonly DataStateEnum = DataStateEnum;

  constructor(private _instanceService: InstanceService, private _activateRoute: ActivatedRoute, private _router: Router) {}

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.instanceState$ = this._activateRoute.data
      .pipe(
        map((response: any) => {
          this.instanceSubject.next(response['instance'].data.data as InstanceModel);
          this.mailServersSubject.next(response['mailServers'].data.data as MailServerModel[]);
          this.unlockFormSubject.next(false);
          return {
            dataState: DataStateEnum.Loaded,
            loggedIn: true,
            data: response['instance'].data.data as InstanceModel
          }
        }),
        startWith({dataState: DataStateEnum.Loading, loggedIn: true}),
        catchError((error: any) => {
          if(typeof error.instances === "string") {
            return of({dataState: DataStateEnum.Error, reason: error['instance'], loggedIn: true});
          }else {
            return of({dataState: DataStateEnum.Error, error: error['instance'] as ValidationErrorModel[], loggedIn: true})
          }
        })
      );
  }

  updateInstance(instanceForm: NgForm): void {
    const instance: InstanceModel = {...instanceForm.value};
    instance.mailServer = this.mailServersSubject.value
      .filter((ms: MailServerModel) => ms.id === instanceForm.value.mailServer.id)[0];
    this.instanceState$ = this._instanceService.updateInstance$(instance.id, instance)
      .pipe(
        map((response: any) => {
          this.instanceSubject.next({...response.data.data} as InstanceModel);
          this.unlockFormSubject.next(false);
          instanceForm.resetForm({...this.instanceSubject.value, mailServer: this.instanceSubject.value.mailServer.id});
          return {
            dataState: DataStateEnum.Loaded, message: response.message, loggedIn: true, data: this.instanceSubject.value
          };
        }),
        startWith({dataState: DataStateEnum.Loading, loggedIn: true, data: this.instanceSubject.value}),
        catchError((error: any) => {
          if(typeof error === "string") {
            return of({dataState: DataStateEnum.Error, reason: error, loggedIn: true, data: this.instanceSubject.value});
          } else {
            return of({dataState: DataStateEnum.Error, error: error as ValidationErrorModel[], loggedIn: true, data: this.instanceSubject.value});
          }
        })
      );
  }

  cancelEditInstance(instanceForm: NgForm): void {
    instanceForm.resetForm({...this.instanceSubject.value, mailServer: this.instanceSubject.value.mailServer.id});
    this.unlockFormSubject.next(false);

  }

  editInstance(): void {
    this.unlockFormSubject.next(true);
  }

  createInstance(): void {
    this._router.navigate(['/instances/new']);
  }

  inactiveInstance(instanceForm: NgForm): void {
    this.instanceState$ = this._instanceService.inactivateInstance$(instanceForm.value.id)
      .pipe(
        map((response: any) => {
          this.instanceSubject.next({...response.data.data} as InstanceModel);
          this.unlockFormSubject.next(false);
          instanceForm.resetForm({...this.instanceSubject.value, mailServer: this.instanceSubject.value.mailServer.id});
          return {
            dataState: DataStateEnum.Loaded, message: response.message, loggedIn: true, data: this.instanceSubject.value
          };
        }),
        startWith({dataState: DataStateEnum.Loading, loggedIn: true, data: this.instanceSubject.value}),
        catchError((error: any) => {
          if(typeof error === "string") {
            return of({dataState: DataStateEnum.Error, reason: error, loggedIn: true, data: this.instanceSubject.value});
          } else {
            return of({dataState: DataStateEnum.Error, error: error as ValidationErrorModel[], loggedIn: true, data: this.instanceSubject.value});
          }
        })
      );
  }

  activeInstance(instanceForm: NgForm): void {
    this.instanceState$ = this._instanceService.activateInstance$(instanceForm.value.id)
      .pipe(
        map((response: any) => {
          this.instanceSubject.next({...response.data.data} as InstanceModel);
          this.unlockFormSubject.next(false);
          instanceForm.resetForm({...this.instanceSubject.value, mailServer: this.instanceSubject.value.mailServer.id});
          return {
            dataState: DataStateEnum.Loaded, message: response.message, loggedIn: true, data: this.instanceSubject.value
          };
        }),
        startWith({dataState: DataStateEnum.Loading, loggedIn: true, data: this.instanceSubject.value}),
        catchError((error: any) => {
          if(typeof error === "string") {
            return of({dataState: DataStateEnum.Error, reason: error, loggedIn: true, data: this.instanceSubject.value});
          } else {
            return of({dataState: DataStateEnum.Error, error: error as ValidationErrorModel[], loggedIn: true, data: this.instanceSubject.value});
          }
        })
      );
  }
}
