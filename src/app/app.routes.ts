import { Routes } from '@angular/router';
import {fetchMailServersResolver, fetchMailServerByIdResolver} from "./resolvers/mail-server.resolver";
import {authenticationGuard} from "./guards/authentication.guard";
import {activateAccountResolver} from "./resolvers/activate-account.resolver";
import {fetchMailBydIdResolver, fetchMailsResolver} from "./resolvers/mail.resolver";
import {fetchInstanceResolver, fetchInstancesResolver} from "./resolvers/instance.resolver";
import {fetchMailHistoriesResolver} from "./resolvers/mail-history.resolver";

export const routes: Routes = [
  {
    path: '', redirectTo:'', pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () => import('./pages/mail-server/mail-servers/mail-servers.component').then(module => module.MailServersComponent),
    resolve: {emailServers: fetchMailServersResolver},
    canActivate: [authenticationGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(module => module.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(module => module.RegisterComponent)
  },
  {
    path: 'activate-account/:verificationCode',
    loadComponent: () => import('./pages/activate-account/activate-account.component').then(module => module.ActivateAccountComponent),
    resolve: {activateAccount: activateAccountResolver}
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password/reset-password.component').then(module => module.ResetPasswordComponent)
  },
  {
    path: 'reset-password/:verificationCode',
    loadComponent: () => import('./pages/reset-password/reset-password.component').then(module => module.ResetPasswordComponent)
  },
  {
    path: 'instances',
    loadComponent: () => import('./pages/instance/instances/instances.component').then(module => module.InstancesComponent),
    resolve: {instances: fetchInstancesResolver},
    canActivate: [authenticationGuard]
  },
  {
    path: 'instances/new',
    loadComponent: () => import('./pages/instance/instance-new/instance-new.component').then(module => module.InstanceNewComponent),
    resolve: {mailServers: fetchMailServersResolver},
    canActivate: [authenticationGuard]
  },
  {
    path: 'instances/details/:id',
    loadComponent: () => import('./pages/instance/instance-details/instance-details.component').then(module => module.InstanceDetailsComponent),
    resolve: {
      instance: fetchInstanceResolver,
      mailServers: fetchMailServersResolver,
    },
    canActivate: [authenticationGuard]
  },
  {
    path: 'mails',
    loadComponent: () => import('./pages/mail/mails/mails.component').then(module => module.MailsComponent),
    resolve: {mails: fetchMailsResolver},
    canActivate: [authenticationGuard]
  },
  {
    path: 'mails/details/:id',
    loadComponent: () => import('./pages/mail/mail-details/mail-details.component').then(module => module.MailDetailsComponent),
    resolve: {
      mail: fetchMailBydIdResolver,
      mailServers: fetchMailServersResolver,
    },
    canActivate: [authenticationGuard]
  },
  {
    path: 'mail-histories',
    loadComponent: () => import('./pages/mail-history/mail-histories/mail-histories.component').then(module => module.MailHistoriesComponent),
    resolve: {mailHistories: fetchMailHistoriesResolver},
    canActivate: [authenticationGuard]
  },
  {
    path: 'mail-servers',
    loadComponent: () => import('./pages/mail-server/mail-servers/mail-servers.component').then(module => module.MailServersComponent),
    resolve: {mailServers: fetchMailServersResolver},
    canActivate: [authenticationGuard]
  },
  {
    path: 'mail-servers/new',
    loadComponent: () => import('./pages/mail-server/mail-server-new/mail-server-new.component').then(module => module.MailServerNewComponent),
    canActivate: [authenticationGuard]
  },
  {
    path: 'mail-servers/details/:id',
    loadComponent: () => import('./pages/mail-server/mail-server-details/mail-server-details.component').then(module => module.MailServerDetailsComponent),
    resolve: {mailServer: fetchMailServerByIdResolver},
    canActivate: [authenticationGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/page-not-found/page-not-found.component').then(module => module.PageNotFoundComponent),
  }
];
