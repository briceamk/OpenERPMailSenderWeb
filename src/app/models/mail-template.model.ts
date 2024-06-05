import {MailTemplateTypeEnum} from "../enums/mail-template-type.enum";

export interface MailTemplateModel {
  id: string;
  name: string;
  type: MailTemplateTypeEnum;
}
