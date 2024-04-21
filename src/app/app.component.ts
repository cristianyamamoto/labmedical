import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'labmedical';

  loggedUserApp: any;

  constructor(private authService: AuthService) { };

  ngOnInit(): void {
    this.loggedUserApp = this.authService.loggedUser();
  };

}
