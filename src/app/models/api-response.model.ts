import {ValidationErrorModel} from "./validation-error.model";
import {PaginatorModel} from "./paginator.model";

export interface ApiResponseModel<T> {
  timestamp: Date;
  code: number;
  status: string;
  success: boolean;
  message?: string;
  reason?: string;
  trackId?: string;
  path?: string;
  error?: ValidationErrorModel[];
  data?: T
}
