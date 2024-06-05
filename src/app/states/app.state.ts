import {DataStateEnum} from "../enums/data-state.enum";
import {ValidationErrorModel} from "../models/validation-error.model";
import {PaginatorModel} from "../models/paginator.model";

export interface AppState<T> {
  dataState: DataStateEnum;
  data?: T;
  error?: ValidationErrorModel[];
  message?: string;
  reason?: string;
  loggedIn: boolean;
}
