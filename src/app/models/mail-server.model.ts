import {ServerTypeEnum} from "../enums/server-type.enum";
import {ServerStatusEnum} from "../enums/server-status.enum";


export interface MailServerModel {
    id: string;
    name: string;
    fromEmail: string;
    createdAt: Date;
    type: ServerTypeEnum;
    host: string;
    port: number;
    useSSL: boolean;
    useAuth: boolean;
    useAsDefault: boolean;
    username?: string;
    password?: string;
    state: ServerStatusEnum;
    verificationCode?: string;
    verifiedAt?: Date;
    protocol: string;
}
