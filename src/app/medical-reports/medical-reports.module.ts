import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../shared/guards/auth.guard';
import { MedicalReportsDetailComponent } from './medical-reports-detail/medical-reports-detail.component';

const medicalReportsRoutes: Routes = [
  {
    path: ":id",
    component: MedicalReportsDetailComponent,
    canActivate: [authGuard],
  },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(medicalReportsRoutes),
  ]
})
export class MedicalReportsModule { }
