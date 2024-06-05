import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of} from "rxjs";
import {PaginatorModel} from "../../models/paginator.model";
import {AsyncPipe, NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";

@Component({
  selector: 'app-table-paginator',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgClass,
    NgForOf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault
  ],
  templateUrl: './table-paginator.component.html',
  styleUrl: './table-paginator.component.css'
})
export class TablePaginatorComponent {
  @Input() pageInfo$: Observable<PaginatorModel> = of(null);
  @Input() showFirst$?: Observable<boolean> = of(true);
  @Input() showLast$?: Observable<boolean> = of(true);
  @Input() currentPage$: Observable<number> = of(0);
  @Output() page: EventEmitter<number> = new EventEmitter<number>();

  onPage(index: number): void {
    this.page.emit(index);
  }

}
