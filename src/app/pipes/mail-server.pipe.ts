import { Pipe, PipeTransform } from '@angular/core';
import {MailServerModel} from "../models/mail-server.model";

@Pipe({
  name: 'mailServer',
  standalone: true,
  pure: true
})
export class MailServerPipe implements PipeTransform {

  transform(mailServer: MailServerModel, name: string): string {
    return mailServer.name;
  }

}
