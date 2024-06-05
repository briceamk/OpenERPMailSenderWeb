import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of} from "rxjs";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-table-size',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './table-size.component.html',
  styleUrl: './table-size.component.css'
})
export class TableSizeComponent {
  @Input() sizes$: Observable<(string|number)[]> = of([]);
  @Output() size:EventEmitter<number> = new EventEmitter<number>();

  onSize($event: any): void {
    this.size.emit($event.target.value);
  }

}
