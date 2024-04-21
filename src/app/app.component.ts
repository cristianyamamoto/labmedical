import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToolbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'labmedical';

  loggedUserApp: any;
  usersList: any[];

  constructor(private authService: AuthService) {
    this.loggedUserApp = this.authService.loggedUser();
    this.usersList = this.authService.getUsers();
  };

  ngOnInit(): void { };

}
