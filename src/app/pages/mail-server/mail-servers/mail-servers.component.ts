import {Component, OnInit} from '@angular/core';
import {TableComponent} from "../../../components/table/table.component";
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {AppState} from "../../../states/app.state";
import {DataStateEnum} from "../../../enums/data-state.enum";
import {MailServerService} from "../../../services/mail-server.service";
import {ValidationErrorModel} from "../../../models/validation-error.model";
import {ApiResponseModel} from "../../../models/api-response.model";
import {AsyncPipe, JsonPipe, NgForOf, NgIf, NgSwitch} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {TableHeaderModel} from "../../../models/table-header.model";
import {TablePaginatorComponent} from "../../../components/table-paginator/table-paginator.component";
import {TableSizeComponent} from "../../../components/table-size/table-size.component";
import {
  DEFAULT_PAGE_SIZE_LIST,
  DEFAULT_PAGINATOR_DIRECTION,
  DEFAULT_PAGINATOR_PAGE,
  DEFAULT_PAGINATOR_SIZE
} from "../../../constants/app.contant";
import {DirectionEnum} from "../../../enums/direction.enum";
import {MailServerModel} from "../../../models/mail-server.model";
import {PageModel} from "../../../models/page.model";
import {SortModel} from "../../../models/sort.model";
import {TableActionComponent} from "../../../components/table-action/table-action.component";
import {TableSearchComponent} from "../../../components/table-search/table-search.component";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-mail-servers',
  standalone: true,
  imports: [
    TableComponent,
    NgIf,
    AsyncPipe,
    JsonPipe,
    NgForOf,
    NgSwitch,
    TablePaginatorComponent,
    TableSizeComponent,
    TableActionComponent,
    TableSearchComponent
  ],
  templateUrl: './mail-servers.component.html',
  styleUrl: './mail-servers.component.css'
})
export class MailServersComponent implements OnInit{

  mailServersState$ :Observable<AppState<PageModel<MailServerModel>>> = of({dataState: DataStateEnum.Loaded, loggedIn: true});
  protected readonly of = of;
  readonly DEFAULT_PAGE_ATTRIBUTE: string = "name";
  currentPageSubject: BehaviorSubject<number> = new BehaviorSubject(DEFAULT_PAGINATOR_PAGE);
  currentSizeSubject: BehaviorSubject<number> = new BehaviorSubject(DEFAULT_PAGINATOR_SIZE);
  currentDirectionSubject: BehaviorSubject<DirectionEnum> = new BehaviorSubject(DEFAULT_PAGINATOR_DIRECTION);
  currentAttributeSubject: BehaviorSubject<string> = new BehaviorSubject(this.DEFAULT_PAGE_ATTRIBUTE);
  readonly sizesSubject: BehaviorSubject<(string | number)[]> = new BehaviorSubject(DEFAULT_PAGE_SIZE_LIST);
  currentSearchSubject: BehaviorSubject<FormControl> = new BehaviorSubject(new FormControl());
  headersSubject: BehaviorSubject<TableHeaderModel[]> = new BehaviorSubject([
    {
      name: 'name',
      label: 'Nom du serveur'
    },
    {
      name: 'fromEmail',
      label: 'Email de'
    },
    {
      name: 'username',
      label: "Utilisateur"
    },
    {
      name: 'host',
      label: "Serveur SMTP"
    },
    {
      name: 'port',
      label: "Port"
    },
    {
      name: 'state',
      label: 'Etat'
    }
  ]);

  constructor(private _mailServerService: MailServerService, private _activateRoute: ActivatedRoute, private _router: Router) {}

  ngOnInit(): void {
    this.mailServersState$ = this._activateRoute.data
      .pipe(
        map((response: any) => {
          return {
            dataState: DataStateEnum.Loaded,
            loggedIn: true,
            message: response['mailServers'].message,
            data: response['mailServers'].data as PageModel<MailServerModel>
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

    this.onSearch();
  }


  fetchMailSevers(page?: number, size?: number, direction?: DirectionEnum, attribute?: string): void {
    let currentPage: number = page === undefined ? DEFAULT_PAGINATOR_PAGE: page;
    let currentSize: number = size === undefined ? DEFAULT_PAGINATOR_SIZE: size;
    let currentDirection: DirectionEnum = direction === undefined ? DEFAULT_PAGINATOR_DIRECTION: direction;
    let currentAttribute: string = attribute === undefined? this.DEFAULT_PAGE_ATTRIBUTE: attribute;
    this.mailServersState$ = this._mailServerService.fetchMailServers$(currentPage, currentSize, currentDirection, currentAttribute)
      .pipe(
        map((response: ApiResponseModel<PageModel<MailServerModel>>) => {
          this.currentPageSubject.next(page);
          this.currentSizeSubject.next(size);
          this.currentAttributeSubject.next(currentAttribute);
          this.currentDirectionSubject.next(currentDirection);
          return {
            dataState: DataStateEnum.Loaded,
            loggedIn: true,
            message: response.message,
            data: response.data as PageModel<MailServerModel>
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
    this.fetchMailSevers(page, this.currentSizeSubject.value, this.currentDirectionSubject.value, this.currentAttributeSubject.value);
  }

  onEdit(emailServer: MailServerModel): void {
    this._router.navigate([`/mail-servers/details/${emailServer.id}`]);
  }

  onSort(sort: SortModel): void {
    this.fetchMailSevers(
      this.currentPageSubject.value,
      this.currentSizeSubject.value,
      sort.direction === DirectionEnum.ASC? DirectionEnum.DSC: DirectionEnum.ASC,
      sort.attribute
    );

  }

  onSize(size: number): void {
    this.fetchMailSevers(
      this.currentPageSubject.value,
      size,
      this.currentDirectionSubject.value,
      this.currentAttributeSubject.value);
  }

  onCreate(): void {
    this._router.navigate([`/mail-servers/new`]);
  }

  onDelete(emailServer: MailServerModel): void {
   //TODO ids of email server to the service for deletion
  }

  onSearch(): void {
    this.currentSearchSubject.value.valueChanges.subscribe((keyword: string) => {
      this.mailServersState$ = this._mailServerService.searchMailServers$(this.currentPageSubject.value,
        this.currentSizeSubject.value, this.currentDirectionSubject.value, this.currentAttributeSubject.value, keyword)
        .pipe(
          map((response: ApiResponseModel<PageModel<MailServerModel>>) => {
            return {
              dataState: DataStateEnum.Loaded,
              loggedIn: true,
              message: response.message,
              data: response.data as PageModel<MailServerModel>
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
