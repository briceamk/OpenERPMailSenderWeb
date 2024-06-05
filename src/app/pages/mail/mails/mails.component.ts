import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {AppState} from "../../../states/app.state";
import {PageModel} from "../../../models/page.model";
import {MailServerModel} from "../../../models/mail-server.model";
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
import {MailModel} from "../../../models/mail.model";
import {ActivatedRoute, Router} from "@angular/router";
import {MailService} from "../../../services/mail.service";
import {ValidationErrorModel} from "../../../models/validation-error.model";
import {ApiResponseModel} from "../../../models/api-response.model";
import {SortModel} from "../../../models/sort.model";
import {AsyncPipe, NgIf} from "@angular/common";
import {TableActionComponent} from "../../../components/table-action/table-action.component";
import {TableComponent} from "../../../components/table/table.component";
import {TablePaginatorComponent} from "../../../components/table-paginator/table-paginator.component";
import {TableSearchComponent} from "../../../components/table-search/table-search.component";
import {TableSizeComponent} from "../../../components/table-size/table-size.component";
import {MailServerPipe} from "../../../pipes/mail-server.pipe";

@Component({
  selector: 'app-mails',
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
  templateUrl: './mails.component.html',
  styleUrl: './mails.component.css'
})
export class MailsComponent implements OnInit {
  mailsState$ :Observable<AppState<PageModel<MailModel>>> = of({dataState: DataStateEnum.Loaded, loggedIn: true});
  protected readonly of = of;
  readonly DEFAULT_PAGE_ATTRIBUTE: string = "createdAt";
  currentPageSubject: BehaviorSubject<number> = new BehaviorSubject(DEFAULT_PAGINATOR_PAGE);
  currentSizeSubject: BehaviorSubject<number> = new BehaviorSubject(DEFAULT_PAGINATOR_SIZE);
  currentDirectionSubject: BehaviorSubject<DirectionEnum> = new BehaviorSubject(DEFAULT_PAGINATOR_DIRECTION);
  currentAttributeSubject: BehaviorSubject<string> = new BehaviorSubject(this.DEFAULT_PAGE_ATTRIBUTE);
  readonly sizesSubject: BehaviorSubject<(string | number)[]> = new BehaviorSubject(DEFAULT_PAGE_SIZE_LIST);
  currentSearchSubject: BehaviorSubject<FormControl> = new BehaviorSubject(new FormControl());
  headersSubject: BehaviorSubject<TableHeaderModel[]> = new BehaviorSubject([
    {
      name: 'createdAt',
      label: 'Date'
    },
    {
      name: 'to',
      label: 'Email à'
    },
    {
      name: 'subject',
      label: "Sujet"
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

  constructor(private _mailService: MailService, private _activateRoute: ActivatedRoute, private _router: Router) {}

  ngOnInit(): void {
    this.mailsState$ = this._activateRoute.data
      .pipe(
        map((response: any) => {
          return {
            dataState: DataStateEnum.Loaded,
            loggedIn: true,
            message: response['mails'].message,
            data: response['mails'].data as PageModel<MailModel>
          }
        }),
        startWith({dataState: DataStateEnum.Loading, loggedIn: true}),
        catchError((error: any) => {
          if(typeof error.emailServers === "string") {
            return of({dataState: DataStateEnum.Error, reason: error['mails'], loggedIn: true});
          }else {
            return of({dataState: DataStateEnum.Error, error: error['mails'] as ValidationErrorModel[], loggedIn: true})
          }
        })
      );

    this.onSearch();
  }

  fetchMails(page?: number, size?: number, direction?: DirectionEnum, attribute?: string): void {
    let currentPage: number = page === undefined ? DEFAULT_PAGINATOR_PAGE: page;
    let currentSize: number = size === undefined ? DEFAULT_PAGINATOR_SIZE: size;
    let currentDirection: DirectionEnum = direction === undefined ? DEFAULT_PAGINATOR_DIRECTION: direction;
    let currentAttribute: string = attribute === undefined? this.DEFAULT_PAGE_ATTRIBUTE: attribute;
    this.mailsState$ = this._mailService.fetchMails$(currentPage, currentSize, currentDirection, currentAttribute)
      .pipe(
        map((response: ApiResponseModel<PageModel<MailModel>>) => {
          this.currentPageSubject.next(page);
          this.currentSizeSubject.next(size);
          this.currentAttributeSubject.next(currentAttribute);
          this.currentDirectionSubject.next(currentDirection);
          return {
            dataState: DataStateEnum.Loaded,
            loggedIn: true,
            message: response.message,
            data: response.data as PageModel<MailModel>
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
    this.fetchMails(page, this.currentSizeSubject.value, this.currentDirectionSubject.value, this.currentAttributeSubject.value);
  }

  onEdit(emailServer: MailServerModel): void {
    this._router.navigate([`/mails/details/${emailServer.id}`]);
  }

  onSort(sort: SortModel): void {
    this.fetchMails(
      this.currentPageSubject.value,
      this.currentSizeSubject.value,
      sort.direction === DirectionEnum.ASC? DirectionEnum.DSC: DirectionEnum.ASC,
      sort.attribute
    );
  }

  onSize(size: number): void {
    this.fetchMails(
      this.currentPageSubject.value,
      size,
      this.currentDirectionSubject.value,
      this.currentAttributeSubject.value);
  }

  onDelete(emailServer: MailServerModel): void {
    //TODO ids of email server to the service for deletion
  }

  onSearch(): void {
    this.currentSearchSubject.value.valueChanges.subscribe((keyword: string) => {
        this.mailsState$ = this._mailService.searchMails$(this.currentPageSubject.value,
          this.currentSizeSubject.value, this.currentDirectionSubject.value, this.currentAttributeSubject.value, keyword)
          .pipe(
            map((response: ApiResponseModel<PageModel<MailModel>>) => {
              return {
                dataState: DataStateEnum.Loaded,
                loggedIn: true,
                message: response.message,
                data: response.data as PageModel<MailModel>
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
