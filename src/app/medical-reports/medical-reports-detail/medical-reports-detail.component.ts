import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-medical-reports-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './medical-reports-detail.component.html',
  styleUrl: './medical-reports-detail.component.scss'
})
export class MedicalReportsDetailComponent {

  patientId: number | undefined = undefined;
  patients: any[] = this.getPatients();
  appointments: any[] = this.getAppoitments();
  exams: any[] = this.getExams();
  selectedPatient: any = undefined;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.activatedRoute.params.subscribe((param) => {
      const patientId = param['id'];
      this.selectedPatient = this.patients.find((patient) => patient.id == patientId);
    });
    if(this.selectedPatient) {
      this.appointments = this.appointments.filter((ap) => ap.patientId == this.selectedPatient.id)
      this.exams = this.exams.filter((ex) => ex.patientId == this.selectedPatient.id)
    }
  }

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

  redirectToEditAppointment(id: number){
    this.router.navigate([`/register-appointment/${id}`], { state: { selectedPatient: this.selectedPatient } });
  }

  redirectToEditExam(id: number){
    console.log(`/register-exam/${id}`);
    this.router.navigate([`/register-exam/${id}`], { state: { selectedPatient: this.selectedPatient } });
  }
}
