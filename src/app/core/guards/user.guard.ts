import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn() && this.authService.isUser()) {
      return true;
    } else if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      // Redirect admins to their dashboard
      this.router.navigate(['/admin-dashboard']);
      return false;
    } else {
      // Redirect unauthenticated users to login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
