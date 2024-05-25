import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { login, signUp } from '../data-type';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7040/api/Account';
  public isUserLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

  signUp(signUpData: signUp): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, signUpData).pipe(
      map((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token); // Lưu token vào localStorage
          this.isUserLoggedIn.next(true);
          return response;
        } else {
          throw new Error('Token not found in response');
        }
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  authReload() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/user-home']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn(): BehaviorSubject<boolean> {
    return this.isUserLoggedIn;
  }

  logout() {
    localStorage.removeItem('token');
    this.isUserLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  login(data: login): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      map((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.isUserLoggedIn.next(true);
          return response;
        } else {
          throw new Error('Token not found in response');
        }
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
