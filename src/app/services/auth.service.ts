import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { login, signUp } from '../data-type';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7040/api/Account';
  public isUserLoggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());


  constructor(private http: HttpClient, private router: Router) { }

  signUp(signUpData: signUp): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, signUpData).pipe(
      map((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
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
    if (this.isLoggedIn()) {
      const role = localStorage.getItem('role');
      if (role === 'Admin') {
        this.router.navigate(['/admin-home']);
      } else {
        this.router.navigate(['/user-auth']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isUserLoggedIn.next(false);
    this.router.navigate(['/']);
  }

  login(data: login): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      map((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);

          // Lưu thông tin người dùng hoặc admin vào localStorage
          if (response.role === 'Admin') {
            localStorage.setItem('admin', JSON.stringify(response));
          } else {
            localStorage.setItem('user', JSON.stringify(response));
          }

          this.isUserLoggedIn.next(true);

          // Kiểm tra localStorage ngay sau khi đăng nhập thành công
          console.log('Admin:', localStorage.getItem('admin'));
          console.log('User:', localStorage.getItem('user'));

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
