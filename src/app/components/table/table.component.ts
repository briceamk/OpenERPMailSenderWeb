import {Component, EventEmitter, Input, Output, Pipe} from '@angular/core';
import {TablePaginatorComponent} from "../table-paginator/table-paginator.component";
import {TableSearchComponent} from "../table-search/table-search.component";
import {TableSizeComponent} from "../table-size/table-size.component";
import {TableActionComponent} from "../table-action/table-action.component";
import {TableHeaderModel} from "../../models/table-header.model";
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgSwitch} from "@angular/common";
import {Observable, of} from "rxjs";
import {DirectionEnum} from "../../enums/direction.enum";
import {SortModel} from "../../models/sort.model";
import {MailServerPipe} from "../../pipes/mail-server.pipe";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    TablePaginatorComponent,
    TableSearchComponent,
    TableSizeComponent,
    TableActionComponent,
    NgForOf,
    AsyncPipe,
    NgIf,
    NgSwitch,
    NgClass,
    MailServerPipe,
    DatePipe
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input() rows$: Observable<any[]> = of([]);
  @Input() headers$: Observable<TableHeaderModel[]> = of([]);
  @Input() sortDirection$: Observable<DirectionEnum> = of(DirectionEnum.ASC);
  @Input() sortAttribute$: Observable<string>;
  @Input() showEdit$?: Observable<boolean> = of(true);
  @Output() edit: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  @Output() sort: EventEmitter<SortModel> = new EventEmitter<SortModel>();


  onEdit(row: any) {
    this.edit.emit(row);
  }

  protected readonly DirectionEnum = DirectionEnum;

  onSort(sortModel: SortModel): void {
    this.sort.emit(sortModel);
  }

  onDelete(row: any): void {
    this.delete.emit(row);
  }


}
