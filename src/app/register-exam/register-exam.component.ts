import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../services/auth.service';
import { PageTitleService } from '../services/page-title.service';

@Component({
  selector: 'app-register-exam',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    ToastModule,
    FormsModule
  ],
  providers: [MessageService],
  templateUrl: './register-exam.component.html',
  styleUrl: './register-exam.component.scss'
})
export class RegisterExamComponent {

  examForm = new FormGroup(
    {
      exam_name: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64)
      ]),
      date: new FormControl("", [Validators.required, ]),
      time: new FormControl("", [Validators.required, ]),
      exam_type: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(32),
      ]),
      laboratory: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(32),
      ]),
      document_url: new FormControl(""),
      results: new FormControl("", [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(1024),
      ])
    }
  )
  usersList: any[] = this.authService.getUsers();
  patientList: any[] = this.getPatients();
  filteredPatients : any = [];
  address: any = undefined;
  exams: any[] = this.getExams();
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

  getExams() {
    const exams = localStorage.getItem("exams");
    if (!!exams) {
      return JSON.parse(exams);
    } else {
      localStorage.setItem("exams", JSON.stringify([]));
      return [];
    };
  }

  createAppointment(){
    const requiredInputs: any = [
      {"Nome do Exame": this.examForm.value.exam_name},
      {"Data": this.examForm.value.date},
      {"Horário": this.examForm.value.time},
      {"Tipo do Exame": this.examForm.value.exam_type},
      {"Laboratório": this.examForm.value.laboratory},
      {"Resultados do Exame": this.examForm.value.results}
    ];
    const optionalInputs: any = [
      {"URL do Documento do Exame": this.examForm.value.document_url}
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
      const id = (this.exams[this.exams.length - 1]?.id ?? -1) + 1;
      const patientId = this.selectedPatient.id;
      const newExam = {
        id,
        exam_name: inputs[0]["Nome do Exame"],
        date: inputs[1]["Data"],
        time: inputs[2]["Horário"],
        exam_type: inputs[3]["Tipo do Exame"],
        laboratory: inputs[4]["Laboratório"],
        document_url: inputs[5]["URL do Documento do Exame"],
        results: inputs[6]["Resultados do Exame"],
        patientId
      };
      this.exams.push(newExam);
      localStorage.setItem("exams", JSON.stringify(this.exams));
      this.messageService.add({
        severity: 'success',
        summary: "Cadastro",
        detail: "Exame cadastrado com sucesso"
      });
      this.examForm.reset();
    }
  }

  selectPatient(id: any){
    this.selectedPatient = this.patientList.find((patient) => patient.id === id);
    this.patientSearch = "";
    this.filteredPatients = [];
  }

  searchPatient() {
    if(!this.patientSearch || !this.patientList) {
      this.filteredPatients = [];
    } else {
      this.filteredPatients = this.patientList.filter((patient: { name: any; }) =>
      patient.name.toLowerCase().includes(this.patientSearch.toLowerCase()));
    }
  }
}
