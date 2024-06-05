import {MailServerModel} from "./mail-server.model";

export interface MailHistoryModel {
  id: string;
  to: string;
  subject: string;
  message: string;
  createdAt: Date;
  mailServer: MailServerModel;
}
