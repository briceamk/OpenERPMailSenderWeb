import {UserModel} from "./user.model";
import {RoleModel} from "./role.model";

export interface ProfileModel {
  user: UserModel;
  roles: RoleModel[];
  accessToken: string;
  refreshToken: string;
}
