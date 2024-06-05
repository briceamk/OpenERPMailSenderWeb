import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-table-action',
  standalone: true,
  imports: [],
  templateUrl: './table-action.component.html',
  styleUrl: './table-action.component.css'
})
export class TableActionComponent {
  @Output() create:EventEmitter<unknown> = new EventEmitter<unknown>();

  onCreate(): void {
    this.create.emit();
  }
}
