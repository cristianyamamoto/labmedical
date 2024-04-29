import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { BirthdateToAgePipe } from '../pipes/birthdate-to-age.pipe';
import { PageTitleService } from '../services/page-title.service';

@Component({
  selector: 'app-medical-reports',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    CommonModule,
    DropdownModule,
    FormsModule,
    BirthdateToAgePipe
  ],
  templateUrl: './medical-reports.component.html',
  styleUrl: './medical-reports.component.scss'
})
export class MedicalReportsComponent {

  loggedUser: {name: string, auth: boolean} | undefined = undefined;
  patients: any[] = this.getPatients();
  appointments: any[] = this.getAppoitments();
  exams: any[] = this.getExams();
  filteredPatients : any = this.patients;
  patient: any = undefined;

  constructor(private router: Router, private pageTitleService: PageTitleService) {
    this.pageTitleService.changeTitle(this.router.url);
   };

  ngOnInit(): void { };

  getPatients() {
    const patients = localStorage.getItem("patients");
    if (!!patients) {
      return JSON.parse(patients);
    } else {
      localStorage.setItem("patients", JSON.stringify([]));
      return [];
    };
  }

  getAppoitments() {
    const appointments = localStorage.getItem("appointments");
    if (!!appointments) {
      return JSON.parse(appointments);
    } else {
      localStorage.setItem("appointments", JSON.stringify([]));
      return [];
    };
  }

  getExams() {
    const exams = localStorage.getItem("exams");
    if (!!exams) {
      return JSON.parse(exams);
    } else {
      localStorage.setItem("exams", JSON.stringify([]));
      return [];
    };
  }

  searchPatient() {
    if(!this.patient) {
      this.filteredPatients = this.patients;
    } else {
      this.filteredPatients = this.patients.filter((patient: { name: any; }) =>
      patient.name.toLowerCase().includes(this.patient.toLowerCase()));
    }
  }

  redirectToDetail(id: string){
    this.router.navigate(["medical-reports", id]);
  }

}
