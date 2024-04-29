import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../services/auth.service';
import { PageTitleService } from '../services/page-title.service';

@Component({
  selector: 'app-register-appointment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    ToastModule,
    FormsModule
  ],
  providers: [MessageService],
  templateUrl: './register-appointment.component.html',
  styleUrl: './register-appointment.component.scss'
})
export class RegisterAppointmentComponent {

  appointmentForm = new FormGroup(
    {
      appointment_motive: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64)
      ]),
      date: new FormControl("", [Validators.required, ]),
      time: new FormControl("", [Validators.required, ]),
      description: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(1024),
      ]),
      medication: new FormControl(""),
      precautions: new FormControl("", [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(256),
      ])
    }
  )
  usersList: any[] = this.authService.getUsers();
  patients: any[] = this.getPatients();
  filteredPatients : any = [];
  address: any = undefined;
  appointments: any[] = this.getAppoitments();
  selectedPatient: any = undefined;
  patientSearch: any = undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private pageTitleService: PageTitleService,
    private messageService: MessageService
  ) {
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

  createAppointment(){
    const requiredInputs: any = [
      {"Motivo da Consulta": this.appointmentForm.value.appointment_motive},
      {"Data": this.appointmentForm.value.date},
      {"Horário": this.appointmentForm.value.time},
      {"Descrição": this.appointmentForm.value.description},
      {"Dosagem e Precauções": this.appointmentForm.value.precautions}
    ];
    const optionalInputs: any = [
      {"Medicação Receitada": this.appointmentForm.value.medication}
    ];
    const inputs = requiredInputs.concat(optionalInputs);

    const checkFormInputs = requiredInputs.find((input: any) => {
      if(!Object.values(input)[0]) {
        this.messageService.add({
          severity: 'error',
          summary: `${Object.keys(input)}`,
          detail: `Preencha o campo: ${Object.keys(input)}!`
        });
        return true;
      }
      return false;
    });

    if (!checkFormInputs){
      const id = (this.appointments[this.appointments.length - 1]?.id ?? -1) + 1;
      const patientId = this.selectedPatient.id;
      const newAppointment = {
        id,
        appointment_motive: inputs[0]["Motivo da Consulta"],
        date: inputs[1]["Data"],
        time: inputs[2]["Horário"],
        description: inputs[3]["Descrição"],
        precautions: inputs[4]["Dosagem e Precauções"],
        medication: inputs[5]["Medicação Receitada"],
        patientId
      };
      this.appointments.push(newAppointment);
      localStorage.setItem("appointments", JSON.stringify(this.appointments));
      this.messageService.add({
        severity: 'success',
        summary: "Cadastro",
        detail: "Consulta cadastrada com sucesso"
      });
      this.appointmentForm.reset();
    }
  }

  selectPatient(id: any){
    this.selectedPatient = this.patients.find((patient) => patient.id === id);
    this.patientSearch = "";
    this.filteredPatients = [];
  }

  searchPatient() {
    if(!this.patientSearch || !this.patients) {
      this.filteredPatients = [];
    } else {
      this.filteredPatients = this.patients.filter((patient: { name: any; }) =>
      patient.name.toLowerCase().includes(this.patientSearch.toLowerCase()));
    }
  }

}
