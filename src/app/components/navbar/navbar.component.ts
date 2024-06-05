import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AsyncPipe, JsonPipe, NgIf} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {Observable, of} from "rxjs";
import {RoleModel} from "../../models/role.model";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    JsonPipe
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() loggedIn: boolean = true;
  @Input() profile$: Observable<any> = of({});
  @Output() logout: EventEmitter<unknown> = new EventEmitter<unknown>();

  onLogout() {
    this.logout.emit();
  }

  getRoleNames(roles: RoleModel[]): string[] {
    return roles.map((role: RoleModel) => role.name);
  }
}
