import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PageTitleService } from '../../../services/page-title.service';

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
  title: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private pageTitleService: PageTitleService
    ) {
    this.authService.getLoggedUser.subscribe(user => this.loggedUser = user);
    this.pageTitleService.title.subscribe(title => this.title = title);
  };

  signOut(){
    this.authService.signOut();
    this.router.navigate(["/login"]);
  }

}
