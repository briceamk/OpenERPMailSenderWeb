import {MailStateEnum} from "../enums/mail-state.enum";
import {MailTemplateTypeEnum} from "../enums/mail-template-type.enum";
import {MailServerModel} from "./mail-server.model";
import {MailTemplateModel} from "./mail-template.model";

export interface MailModel {
  id: string;
  to: string;
  subject: string;
  message: string;
  externalId: number;
  externalServerId: number;
  attemptToSend: number;
  instanceId: number;
  type: MailTemplateTypeEnum;
  state: MailStateEnum;
  createdAt: Date;
  sendAt: Date;
  mailServer: MailServerModel;
  mailTemplate: MailTemplateModel;
}
