import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ToastModule,
    ProgressSpinnerModule
],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  loginForm = new FormGroup(
    {
      email: new FormControl("", [Validators.required, ]),
      password: new FormControl("", [Validators.required, ])
    }
  )
  usersList: any[];
  redirect: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.usersList = this.authService.getUsers();
  };

  ngOnInit(): void {
    this.createTempUser();
  };

  createTempUser(){
    let tempUser = {
      name: "cristian",
      email: "cristian_yamamoto@estudante.sesisenai.org.br",
      weight: 68,
      height: 170,
      birthdate: "1998/05/06",
      cep: "88037-460",
      password: "123",
      auth: false
    };
    if (this.authService.authenticateEmail(tempUser.email, this.usersList)) {
      return; // user already created
    } else {
      this.usersList.push(tempUser);
      localStorage.setItem("users", JSON.stringify(this.usersList));
    }
  }

  signIn() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    if (!email){
      this.messageService.add({ severity: 'error', summary: 'E-mail', detail: 'Digite o E-mail do usuário!' });
    } else if (!password) {
      this.messageService.add({ severity: 'error', summary: 'Senha', detail: 'Digite a senha!' });
    } else {
      const user = this.authService.authenticateEmail(email, this.usersList);
      if(user) {
        const pass = this.authService.authenticatePassword(user, this.loginForm.value.password);
        if(pass) {
          user.auth = true;
          localStorage.setItem("users", JSON.stringify(this.usersList));
          this.messageService.add({ severity: 'success', summary: 'Login', detail: 'Redirecionando para página inicial' });
          this.redirect = true;
          setTimeout(() => {
            this.router.navigate([""]);
          }, 2000);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Senha', detail: 'Senha incorreta!' });
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'E-mail', detail: 'E-mail não encontrado!' });
      }
    }
  }

  forgotPassword() {
    const email = this.loginForm.value.email;
    if (email) {
      let user = this.usersList.find((user: { email: string | null | undefined; }) => user.email == email);
      user.password = "123@321";
      localStorage.setItem("users", JSON.stringify(this.usersList));
      this.messageService.add({ severity: 'info', summary: 'Senha', detail: 'Senha redefinida para: 123@321' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'E-mail', detail: 'Digite o E-mail do usuário' });
    }
  }
}
