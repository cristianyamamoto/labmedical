import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  expandSidebar: boolean = true;
  @Input() loggedUser: any;

  constructor( private authService: AuthService) {
    this.authService.getLoggedUser.subscribe(user => this.loggedUser = user);
  };

  signOut(){
    this.authService.signOut();
  }
}
