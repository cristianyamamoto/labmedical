import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: "",
    pathMatch: "full"
  },
  // {
  //   path: 'home',
  //   component: HomeComponent,
  //   canActivate: [authGuard]
  // },
  {
    path: 'login',
    component: LoginComponent
  },
  // {
  //   path: 'signup',
  //   component: SignupComponent
  // },
];
