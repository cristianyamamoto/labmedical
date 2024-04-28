import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  @Input() loggedUser: any;
  @Input() usersList: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
    ) {
    this.authService.getLoggedUser.subscribe(user => this.loggedUser = user);
  };

  signOut(){
    this.authService.signOut();
    this.router.navigate(["/login"]);
  }

}
