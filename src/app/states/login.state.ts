import {DataStateEnum} from "../enums/data-state.enum";
import {ValidationErrorModel} from "../models/validation-error.model";
import {AppState} from "./app.state";

export interface LoginState extends AppState<any>{
  loginSuccess?: boolean;
  useMfa?: boolean;
  email?: string;
}
