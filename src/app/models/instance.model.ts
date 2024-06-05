import {MailServerModel} from "./mail-server.model";
import {InstanceStateEnum} from "../enums/instance-state.enum";

export interface InstanceModel {
  id: string;
  host: string;
  port: number;
  db: string;
  username: string;
  password: string;
  mailServer: MailServerModel;
  state?: InstanceStateEnum;
}
