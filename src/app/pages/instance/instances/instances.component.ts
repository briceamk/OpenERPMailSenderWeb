import { Component } from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, startWith, of} from "rxjs";
import {AppState} from "../../../states/app.state";
import {PageModel} from "../../../models/page.model";
import {InstanceModel} from "../../../models/instance.model";
import {DataStateEnum} from "../../../enums/data-state.enum";
import {
  DEFAULT_PAGE_SIZE_LIST,
  DEFAULT_PAGINATOR_DIRECTION,
  DEFAULT_PAGINATOR_PAGE,
  DEFAULT_PAGINATOR_SIZE
} from "../../../constants/app.contant";
import {DirectionEnum} from "../../../enums/direction.enum";
import {FormControl} from "@angular/forms";
import {TableHeaderModel} from "../../../models/table-header.model";
import {MailServerPipe} from "../../../pipes/mail-server.pipe";
import {ActivatedRoute, Router} from "@angular/router";
import {ValidationErrorModel} from "../../../models/validation-error.model";
import {ApiResponseModel} from "../../../models/api-response.model";
import {MailServerModel} from "../../../models/mail-server.model";
import {SortModel} from "../../../models/sort.model";
import {InstanceService} from "../../../services/instance.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {TableActionComponent} from "../../../components/table-action/table-action.component";
import {TableComponent} from "../../../components/table/table.component";
import {TablePaginatorComponent} from "../../../components/table-paginator/table-paginator.component";
import {TableSearchComponent} from "../../../components/table-search/table-search.component";
import {TableSizeComponent} from "../../../components/table-size/table-size.component";

@Component({
  selector: 'app-instances',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    TableActionComponent,
    TableComponent,
    TablePaginatorComponent,
    TableSearchComponent,
    TableSizeComponent
  ],
  templateUrl: './instances.component.html',
  styleUrl: './instances.component.css'
})
export class InstancesComponent {
  instancesState$ :Observable<AppState<PageModel<InstanceModel>>> = of({dataState: DataStateEnum.Loaded, loggedIn: true});
  protected readonly of = of;
  readonly DEFAULT_PAGE_ATTRIBUTE: string = "host";
  currentPageSubject: BehaviorSubject<number> = new BehaviorSubject(DEFAULT_PAGINATOR_PAGE);
  currentSizeSubject: BehaviorSubject<number> = new BehaviorSubject(DEFAULT_PAGINATOR_SIZE);
  currentDirectionSubject: BehaviorSubject<DirectionEnum> = new BehaviorSubject(DEFAULT_PAGINATOR_DIRECTION);
  currentAttributeSubject: BehaviorSubject<string> = new BehaviorSubject(this.DEFAULT_PAGE_ATTRIBUTE);
  readonly sizesSubject: BehaviorSubject<(string | number)[]> = new BehaviorSubject(DEFAULT_PAGE_SIZE_LIST);
  currentSearchSubject: BehaviorSubject<FormControl> = new BehaviorSubject(new FormControl());
  headersSubject: BehaviorSubject<TableHeaderModel[]> = new BehaviorSubject([
    {
      name: 'host',
      label: 'Serveur'
    },
    {
      name: 'port',
      label: 'Port'
    },
    {
      name: 'username',
      label: "Utilisateur"
    },
    {
      name: 'db',
      label: "Base de données"
    },
    {
      name: 'mailServer',
      label: "Serveur",
      displayPipe: true,
      pipe: MailServerPipe,
      arguments: [{name: 'name', show: true}]
    },
    {
      name: 'state',
      label: "Etat"
    }
  ]);

  constructor(private _instanceService: InstanceService, private _activateRoute: ActivatedRoute, private _router: Router) {}

  ngOnInit(): void {
    this.instancesState$ = this._activateRoute.data
      .pipe(
        map((response: any) => {
          return {
            dataState: DataStateEnum.Loaded,
            loggedIn: true,
            message: response['instances'].message,
            data: response['instances'].data as PageModel<InstanceModel>
          }
        }),
        startWith({dataState: DataStateEnum.Loading, loggedIn: true}),
        catchError((error: any) => {
          if(typeof error.emailServers === "string") {
            return of({dataState: DataStateEnum.Error, reason: error['instances'], loggedIn: true});
          }else {
            return of({dataState: DataStateEnum.Error, error: error['instances'] as ValidationErrorModel[], loggedIn: true})
          }
        })
      );

    this.onSearch();
  }

  fetchInstances(page?: number, size?: number, direction?: DirectionEnum, attribute?: string): void {
    let currentPage: number = page === undefined ? DEFAULT_PAGINATOR_PAGE: page;
    let currentSize: number = size === undefined ? DEFAULT_PAGINATOR_SIZE: size;
    let currentDirection: DirectionEnum = direction === undefined ? DEFAULT_PAGINATOR_DIRECTION: direction;
    let currentAttribute: string = attribute === undefined? this.DEFAULT_PAGE_ATTRIBUTE: attribute;
    this.instancesState$ = this._instanceService.fetchInstances$(currentPage, currentSize, currentDirection, currentAttribute)
      .pipe(
        map((response: ApiResponseModel<PageModel<InstanceModel>>) => {
          this.currentPageSubject.next(page);
          this.currentSizeSubject.next(size);
          this.currentAttributeSubject.next(currentAttribute);
          this.currentDirectionSubject.next(currentDirection);
          return {
            dataState: DataStateEnum.Loaded,
            loggedIn: true,
            message: response.message,
            data: response.data as PageModel<InstanceModel>
          }
        }),
        startWith({dataState: DataStateEnum.Loading, loggedIn: true}),
        catchError((error: any) => {
          if(typeof error === "string") {
            return of({dataState: DataStateEnum.Error, reason: error, loggedIn: true});
          }else {
            return of({dataState: DataStateEnum.Error, error: error as ValidationErrorModel[], loggedIn: true})
          }
        })
      );
  }

  onPage(page: number): void {
    this.fetchInstances(page, this.currentSizeSubject.value, this.currentDirectionSubject.value, this.currentAttributeSubject.value);
  }

  onEdit(emailServer: MailServerModel): void {
    this._router.navigate([`/instances/details/${emailServer.id}`]);
  }

  onSort(sort: SortModel): void {
    this.fetchInstances(
      this.currentPageSubject.value,
      this.currentSizeSubject.value,
      sort.direction === DirectionEnum.ASC? DirectionEnum.DSC: DirectionEnum.ASC,
      sort.attribute
    );
  }

  onSize(size: number): void {
    this.fetchInstances(
      this.currentPageSubject.value,
      size,
      this.currentDirectionSubject.value,
      this.currentAttributeSubject.value);
  }

  onCreate(): void {
    this._router.navigate([`/instances/new`]);
  }

  onDelete(emailServer: MailServerModel): void {
    //TODO ids of email server to the service for deletion
  }

  onSearch(): void {
    this.currentSearchSubject.value.valueChanges.subscribe((keyword: string) => {
        this.instancesState$ = this._instanceService.search$(this.currentPageSubject.value,
          this.currentSizeSubject.value, this.currentDirectionSubject.value, this.currentAttributeSubject.value, keyword)
          .pipe(
            map((response: ApiResponseModel<PageModel<InstanceModel>>) => {
              return {
                dataState: DataStateEnum.Loaded,
                loggedIn: true,
                message: response.message,
                data: response.data as PageModel<InstanceModel>
              }
            }),
            startWith({dataState: DataStateEnum.Loading, loggedIn: true}),
            catchError((error: any) => {
              if(typeof error === "string") {
                return of({dataState: DataStateEnum.Error, reason: error, loggedIn: true});
              }else {
                return of({dataState: DataStateEnum.Error, error: error as ValidationErrorModel[], loggedIn: true})
              }
            })
          );
      }
    );
  }

  onClear(): void {
  }
}
