import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() getLoggedUser: EventEmitter<any> = new EventEmitter();

  constructor() { }

  authenticateEmail(email: string | null | undefined, usersList: any[]) {
    return usersList.find((user: {
      email: string | null | undefined;
    }) => {
      if(user.email == email) {
        return user;
      }
      return undefined;
    });;
  }

  authenticatePassword(user: {
    auth: boolean;
    password: string;
  }, password: string | null | undefined) {
    if(user.password == password){
      this.getLoggedUser.emit(user);
      return true
    } else {
      this.getLoggedUser.emit("");
      return false;
    }
  }

  getUsers(){
    const users = localStorage.getItem("users");
    if (!!users) {
      return JSON.parse(users);
    } else {
      localStorage.setItem("users", JSON.stringify([]));
      return [];
    };
  }

  loggedUser(){
    const users = this.getUsers();
    return users.find((user: { auth: boolean; }) => user.auth == true);
  }

}
