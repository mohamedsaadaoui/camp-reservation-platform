import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public authService: AuthService, private router: Router) {}

  goHome(): void {
    this.router.navigate(['/map']);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/map']);
  }
}
