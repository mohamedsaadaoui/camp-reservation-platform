import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.error = '';
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.authService.saveSession(response);
        this.router.navigate(['/map']);
      },
      error: () => {
        this.error = 'Identifiants invalides';
      }
    });
  }
}
