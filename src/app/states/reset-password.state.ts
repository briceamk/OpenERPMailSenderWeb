import {DataStateEnum} from "../enums/data-state.enum";
import {ValidationErrorModel} from "../models/validation-error.model";
import {AppState} from "./app.state";

export interface ResetPasswordState extends AppState<any>{
  requestResetPasswordLink?: boolean;
}
