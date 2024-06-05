import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {AppState} from "../../../states/app.state";
import {PageModel} from "../../../models/page.model";
import {MailHistoryModel} from "../../../models/mail-history.model";
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
import {MailHistoryService} from "../../../services/mail-history.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ValidationErrorModel} from "../../../models/validation-error.model";
import {ApiResponseModel} from "../../../models/api-response.model";
import {SortModel} from "../../../models/sort.model";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {TableSearchComponent} from "../../../components/table-search/table-search.component";
import {TableComponent} from "../../../components/table/table.component";
import {TableSizeComponent} from "../../../components/table-size/table-size.component";
import {TablePaginatorComponent} from "../../../components/table-paginator/table-paginator.component";

@Component({
  selector: 'app-mail-histories',
  standalone: true,
  imports: [
    AsyncPipe,
    TableSearchComponent,
    TableComponent,
    TableSizeComponent,
    TablePaginatorComponent,
    NgIf
  ],
  templateUrl: './mail-histories.component.html',
  styleUrl: './mail-histories.component.css'
})
export class MailHistoriesComponent implements OnInit{
  mailHistoriesState$ :Observable<AppState<PageModel<MailHistoryModel>>> = of({dataState: DataStateEnum.Loaded, loggedIn: true});
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
      name: 'to',
      label: 'Envoyer à'
    },
    {
      name: 'subject',
      label: "Sujet"
    },
    {
      name: 'createdAt',
      label: 'Date',
      pipe: DatePipe
    },
    {
      name: 'mailServer',
      label: "Serveur",
      displayPipe: true,
      pipe: MailServerPipe,
      arguments: [{name: 'name', show: true}]
    }
  ]);

  constructor(
    private _mailHistoryService: MailHistoryService,
    private _activateRoute: ActivatedRoute, private _router: Router
  ) {}

  ngOnInit(): void {
    this.mailHistoriesState$ = this._activateRoute.data
      .pipe(
        map((response: any) => {
          return {
            dataState: DataStateEnum.Loaded,
            loggedIn: true,
            message: response['mailHistories'].message,
            data: response['mailHistories'].data as PageModel<MailHistoryModel>
          }
        }),
        startWith({dataState: DataStateEnum.Loading, loggedIn: true}),
        catchError((error: any) => {
          if(typeof error.mailHistory === "string") {
            return of({dataState: DataStateEnum.Error, reason: error['mailHistories'], loggedIn: true});
          }else {
            return of({dataState: DataStateEnum.Error, error: error['mailHistories'] as ValidationErrorModel[], loggedIn: true})
          }
        }),
      );

    this.onSearch();
  }

  fetchMailHistories(page?: number, size?: number, direction?: DirectionEnum, attribute?: string): void {
    let currentPage: number = page === undefined ? DEFAULT_PAGINATOR_PAGE: page;
    let currentSize: number = size === undefined ? DEFAULT_PAGINATOR_SIZE: size;
    let currentDirection: DirectionEnum = direction === undefined ? DEFAULT_PAGINATOR_DIRECTION: direction;
    let currentAttribute: string = attribute === undefined? this.DEFAULT_PAGE_ATTRIBUTE: attribute;
    this.mailHistoriesState$ = this._mailHistoryService.fetchMailHistories$(currentPage, currentSize, currentDirection, currentAttribute)
      .pipe(
        map((response: ApiResponseModel<PageModel<MailHistoryModel>>) => {
          this.currentPageSubject.next(page);
          this.currentSizeSubject.next(size);
          this.currentAttributeSubject.next(currentAttribute);
          this.currentDirectionSubject.next(currentDirection);
          return {
            dataState: DataStateEnum.Loaded,
            loggedIn: true,
            message: response.message,
            data: response.data as PageModel<MailHistoryModel>
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
    this.fetchMailHistories(page, this.currentSizeSubject.value, this.currentDirectionSubject.value, this.currentAttributeSubject.value);
  }

  onEdit(emailHistory: MailHistoryModel): void {
    this._router.navigate([`/mail-histories/details/${emailHistory.id}`]);
  }

  onSort(sort: SortModel): void {
    this.fetchMailHistories(
      this.currentPageSubject.value,
      this.currentSizeSubject.value,
      sort.direction === DirectionEnum.ASC? DirectionEnum.DSC: DirectionEnum.ASC,
      sort.attribute
    );
  }

  onSize(size: number): void {
    this.fetchMailHistories(
      this.currentPageSubject.value,
      size,
      this.currentDirectionSubject.value,
      this.currentAttributeSubject.value);
  }

  onCreate(): void {
    this._router.navigate([`/mailHistory/new`]);
  }

  onDelete(mailHistory: MailHistoryModel): void {
    //TODO ids of emailHistory server to the service for deletion
  }

  onSearch(): void {
    this.currentSearchSubject.value.valueChanges.subscribe((keyword: string) => {
        this.mailHistoriesState$ = this._mailHistoryService.searchMailHistories$(this.currentPageSubject.value,
          this.currentSizeSubject.value, this.currentDirectionSubject.value, this.currentAttributeSubject.value, keyword)
          .pipe(
            map((response: ApiResponseModel<PageModel<MailHistoryModel>>) => {
              return {
                dataState: DataStateEnum.Loaded,
                loggedIn: true,
                message: response.message,
                data: response.data as PageModel<MailHistoryModel>
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

  transform(data: MailHistoryModel[]): MailHistoryModel[] {

    return data;
  }
}
