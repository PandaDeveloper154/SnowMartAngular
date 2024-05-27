import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    const role = localStorage.getItem('role');
    if (role && role === 'Admin' && this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/admin-auth']);
      return false;
    }
  }
}
