import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterAppointmentComponent } from './register-appointment/register-appointment.component';
import { RegisterExamComponent } from './register-exam/register-exam.component';
import { RegisterPatientComponent } from './register-patient/register-patient.component';
import { authGuard } from './shared/guards/auth.guard';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'register-patient',
    component: RegisterPatientComponent,
    canActivate: [authGuard]
  },
  {
    path: 'register-appointment',
    component: RegisterAppointmentComponent,
    canActivate: [authGuard]
  },
  {
    path: 'register-exam',
    component: RegisterExamComponent,
    canActivate: [authGuard]
  },
];
