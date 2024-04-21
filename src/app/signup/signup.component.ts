import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule,
    RouterLink,
    CommonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {

  signUpForm = new FormGroup(
    {
      name: new FormControl("", [Validators.required, ]),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      ]),
      birthdate: new FormControl("", [Validators.required, ]),
      cep: new FormControl("", [
        Validators.required,
        Validators.pattern("^([0-9]{5}-[0-9]{3})|([0-9]{8})$"),
        Validators.maxLength(9)
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(8)
      ]),
      confirm_password: new FormControl("", [
        Validators.required,
        Validators.minLength(8)
      ])
    }
  )
  usersList: any[];

  constructor(
    private authService: AuthService,
    private messageService: MessageService
    ) {
    this.usersList = this.authService.getUsers();
  };

  ngOnInit(): void { };

  signUp(){
    const inputs = [
      { "Nome": this.signUpForm.value.name },
      { "E-mail": this.signUpForm.value.email },
      { "Data de Nascimento" : this.signUpForm.value.birthdate },
      { "CEP" : this.signUpForm.value.cep },
      { "Senha": this.signUpForm.value.password },
      { "Confirmar Senha": this.signUpForm.value.confirm_password },
    ]

    const checkFormInputs = inputs.find((input) => {
      if(!Object.values(input)[0]) {
        this.messageService.add({ severity: 'error', summary: `${Object.keys(input)}`, detail: `Preencha o campo: ${Object.keys(input)}` });
        return true;
      }
      return false;
    });

    if (!checkFormInputs){
      if(inputs[4]["Senha"] === inputs[5]["Confirmar Senha"]) {
        if(this.authService.authenticateEmail(inputs[1]["E-mail"], this.usersList)) {
          this.messageService.add({ severity: 'error', summary: 'E-mail', detail: 'E-mail já cadastrado.' });
        } else {
          const newUser = {
            name: inputs[0]["Nome"],
            email: inputs[1]["E-mail"],
            birthdate: inputs[2]["Data de Nascimento"],
            cep: inputs[3]["CEP"],
            password: inputs[4]["Senha"],
            auth: false
          };
          this.usersList.push(newUser);
          localStorage.setItem("users", JSON.stringify(this.usersList));
          this.messageService.add({ severity: 'success', summary: 'Cadastro', detail: 'Usuário cadastrado com sucesso.' });
          this.signUpForm.reset();
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'Confirmar Senha', detail: 'Senha não corresponde.' });
      }
    }
  }
}
