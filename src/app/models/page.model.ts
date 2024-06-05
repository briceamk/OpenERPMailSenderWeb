import {PaginatorModel} from "./paginator.model";

export interface PageModel<T> {
  data: T[];
  pageInfo: PaginatorModel;
}
