export interface UserModel {
  id: number;
  firstName?: string;
  lastName: string;
  email: string;
  phone?: string;
  imageUrl: string;
  accountEnabled: boolean;
  accountNotLocked: boolean;
  credentialsNotExpired: boolean;
  useMfa: boolean;
  createAt?: Date;
  roleName: string;
  permissions: string;
}
