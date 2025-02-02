import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AddressService } from '../services/address.service';
import { AuthService } from '../services/auth.service';
import { PageTitleService } from '../services/page-title.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-register-patient',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    ToastModule,
    ButtonModule
  ],
  providers: [MessageService],
  templateUrl: './register-patient.component.html',
  styleUrl: './register-patient.component.scss'
})
export class RegisterPatientComponent {

  patientForm = new FormGroup(
    {
      name: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64)
      ]),
      gender: new FormControl("", [Validators.required]),
      birthdate: new FormControl("", [Validators.required, ]),
      CPF: new FormControl("", [
        Validators.required,
        Validators.pattern("^([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})$")
      ]),
      RG: new FormControl("", [
        Validators.required,
        Validators.maxLength(20),
      ]),
      marital_status: new FormControl("", [Validators.required]),
      phone: new FormControl("", [
        Validators.required,
        Validators.pattern("^(?:(^\\+\\d{2})?)(?:([1-9]{2})|([0-9]{3})?)(\\d{4,5}).?(\\d{4})$")
      ]),
      email: new FormControl("", [
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      ]),
      nationality: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64)
      ]),
      emergency_contact: new FormControl("", [
        Validators.required,
        Validators.pattern("^(?:(^\\+\\d{2})?)(?:([1-9]{2})|([0-9]{3})?)(\\d{4,5}).?(\\d{4})$")
      ]),
      alergies: new FormControl(""),
      special_needs: new FormControl(""),
      health_insurance: new FormControl(""),
      health_insurance_number: new FormControl(""),
      health_insurance_expiration: new FormControl(""),
      cep: new FormControl("", [
        Validators.required,
        Validators.pattern("^([0-9]{5}-[0-9]{3})|([0-9]{8})$"),
        Validators.maxLength(9)
      ]),
      address_number: new FormControl(""),
      address_complement: new FormControl(""),
      address_reference: new FormControl(""),
      city: new FormControl(""),
      street: new FormControl(""),
      state: new FormControl(""),
      neighbourhood: new FormControl("")
    }
  )
  usersList: any[] = this.authService.getUsers();
  genders: string[] = ['Masculino', 'Feminino', 'Outro', 'Não Informar'];
  marital_statuses: string[] = ['Casado', 'Solteiro', 'Outro'];
  patients: any[] = this.getPatients();
  address: any = undefined;
  edit: boolean = false;
  selectedPatient: any = undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private pageTitleService: PageTitleService,
    private messageService: MessageService,
    private addressService: AddressService,
    private activatedRoute: ActivatedRoute
  ) {
    this.pageTitleService.changeTitle(this.router.url);
    this.activatedRoute.params.subscribe((param) => {
      const patientId = param['id'];
      if(patientId){
        this.pageTitleService.changeTitle("edit-patient");
        this.selectedPatient = this.patients.find((patient) => patient.id == patientId);
        this.edit = true
        this.patientForm.patchValue(
          {
            name: this.selectedPatient.name,
            gender: this.selectedPatient.gender,
            birthdate: this.selectedPatient.birthdate,
            CPF: this.selectedPatient.CPF,
            RG: this.selectedPatient.RG,
            marital_status: this.selectedPatient.marital_status,
            phone: this.selectedPatient.phone,
            email: this.selectedPatient.email,
            nationality: this.selectedPatient.nationality,
            emergency_contact: this.selectedPatient.emergency_contact,
            alergies: this.selectedPatient.alergies,
            special_needs: this.selectedPatient.special_needs,
            health_insurance: this.selectedPatient.health_insurance,
            health_insurance_number: this.selectedPatient.health_insurance_number,
            health_insurance_expiration: this.selectedPatient.health_insurance_expiration,
            cep: this.selectedPatient.cep,
            address_number: this.selectedPatient.address_number,
            address_complement: this.selectedPatient.address_complement,
            address_reference: this.selectedPatient.address_reference
          }
        )
        this.searchCEP();
      }
    });
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

  createPatient(){
    const requiredInputs: any = [
      {"Nome Completo": this.patientForm.value.name},
      {"Gênero": this.patientForm.value.gender},
      {"Data de Nascimento": this.patientForm.value.birthdate},
      {"CPF": this.patientForm.value.CPF},
      {"RG": this.patientForm.value.RG},
      {"Estado Civil": this.patientForm.value.marital_status},
      {"Telefone": this.patientForm.value.phone},
      {"Naturalidade": this.patientForm.value.nationality},
      {"Contato de Emergência": this.patientForm.value.emergency_contact},
      {"CEP": this.patientForm.value.cep}
    ];
    const optionalInputs: any = [
      {"E-mail": this.patientForm.value.email},
      {"Alergias": this.patientForm.value.alergies},
      {"Cuidados Específicos": this.patientForm.value.special_needs},
      {"Convênio": this.patientForm.value.health_insurance},
      {"Número do Convênio": this.patientForm.value.health_insurance_number},
      {"Validade do Convênio": this.patientForm.value.health_insurance_expiration},
      {"Número do Endereço": this.patientForm.value.address_number},
      {"Complemento": this.patientForm.value.address_complement},
      {"Ponto de Referência": this.patientForm.value.address_reference}
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
      const id = (this.patients[this.patients.length - 1]?.id ?? -1) + 1;
      const newPatient = {
        id,
        name: inputs[0]["Nome Completo"],
        gender: inputs[1]["Gênero"],
        birthdate: inputs[2]["Data de Nascimento"],
        CPF: inputs[3]["CPF"],
        RG: inputs[4]["RG"],
        marital_status: inputs[5]["Estado Civil"],
        phone: inputs[6]["Telefone"],
        nationality: inputs[7]["Naturalidade"],
        emergency_contact: inputs[8]["Contato de Emergência"],
        cep: inputs[9]["CEP"],
        email: inputs[10]["E-mail"],
        alergies: inputs[11]["Alergias"],
        special_needs: inputs[12]["Cuidados Específicos"],
        health_insurance: inputs[13]["Convênio"],
        health_insurance_number: inputs[14]["Número do Convênio"],
        health_insurance_expiration: inputs[15]["Validade do Convênio"],
        address_number: inputs[16]["Número do Endereço"],
        address_complement: inputs[17]["Complemento"],
        address_reference: inputs[18]["Ponto de Referência"]
      };
      this.patients.push(newPatient);
      localStorage.setItem("patients", JSON.stringify(this.patients));
      this.messageService.add({
        severity: 'success',
        summary: "Cadastro",
        detail: "Paciente cadastrado com sucesso"
      });
      this.patientForm.reset();
    }
  }

  searchCEP() {
    this.addressService.getAddress(this.patientForm.value.cep).subscribe(
      {
        next: (response) => {
          this.address = response;
        },
        error: (error) => {
          console.error(error);
        }
      }
    );
  }

  delete(){
    this.patients = this.patients.filter((p)=> p.id !== this.selectedPatient.id);
    localStorage.setItem("patients", JSON.stringify(this.patients));
    this.messageService.add({
      severity: 'success',
      summary: "Deletado",
      detail: "Paciente deletado com sucesso"
    });
    this.patientForm.reset();
    this.edit = false;
    setTimeout(() => {
      this.router.navigate([""]);
    }, 2000);
  }

  update(){
    this.patients.find((patient)=> {
      if (patient.id === this.selectedPatient.id) {
        Object.assign(patient,
          {
            name: this.patientForm.value.name,
            gender: this.patientForm.value.gender,
            birthdate: this.patientForm.value.birthdate,
            CPF: this.patientForm.value.CPF,
            RG: this.patientForm.value.RG,
            marital_status: this.patientForm.value.marital_status,
            phone: this.patientForm.value.phone,
            nationality: this.patientForm.value.nationality,
            emergency_contact: this.patientForm.value.emergency_contact,
            cep: this.patientForm.value.cep,
            email: this.patientForm.value.email,
            alergies: this.patientForm.value.alergies,
            special_needs: this.patientForm.value.special_needs,
            health_insurance: this.patientForm.value.health_insurance,
            health_insurance_number: this.patientForm.value.health_insurance_number,
            health_insurance_expiration: this.patientForm.value.health_insurance_expiration,
            address_number: this.patientForm.value.address_number,
            address_complement: this.patientForm.value.address_complement,
            address_reference: this.patientForm.value.address_reference
          }
        );
        return true;
      }
      return false;
    });
    localStorage.setItem("patients", JSON.stringify(this.patients));
    this.messageService.add({
      severity: 'success',
      summary: "Editado",
      detail: "Informações editadas com sucesso"
    });
    this.patientForm.reset();
    this.edit = false;
    setTimeout(() => {
      this.router.navigate([""]);
    }, 2000);
  }

}
