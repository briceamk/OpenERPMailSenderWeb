import {Pipe, PipeTransform} from "@angular/core";
import {PipeArgumentModel} from "./pipe-argument.model";

export interface TableHeaderModel {
  name: string;
  label: string;
  displayPipe?: boolean;
  pipe?: Pipe;
  arguments?: PipeArgumentModel[]
}
