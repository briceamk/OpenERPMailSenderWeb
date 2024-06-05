import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Observable, of} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-table-search',
  standalone: true,
  imports: [
    FormsModule,
    AsyncPipe,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './table-search.component.html',
  styleUrl: './table-search.component.css'
})
export class TableSearchComponent {
  @Input() search$: Observable<FormControl> = of(new FormControl());
  @Output() clear = new EventEmitter<unknown>();

}
