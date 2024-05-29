import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AccountDto, Login, SignUp } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7040/api/Account';
  public isUserLoggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService) { }

  signUp(signUpData: SignUp): Observable<AccountDto> {
    return this.http.post<AccountDto>(`${this.apiUrl}/register`, signUpData).pipe(
      map((response: any) => {
        const accountDto: AccountDto = {
          UserName: response.userName,
          Email: response.email,
          Token: response.token,
          Role: response.role
        };
        if (accountDto.Token) {
          this.handleAuthentication(accountDto);
          this.isUserLoggedIn.next(true);
          return accountDto;
        } else {
          throw new Error('Token not found in response');
        }
      }),
      catchError(error => throwError(error))
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
    const token = localStorage.getItem('token');
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isUserLoggedIn.next(false);
    this.router.navigate(['/']);
  }
  login(data: Login): Observable<AccountDto> {
    return this.http.post<AccountDto>(`${this.apiUrl}/login`, data).pipe(
      map((response: any) => {
        const accountDto: AccountDto = {
          UserName: response.userName,
          Email: response.email,
          Token: response.token,
          Role: response.role
        };
        if (accountDto.Token) {
          this.handleAuthentication(accountDto);
          this.isUserLoggedIn.next(true);
          return accountDto;
        } else {
          throw new Error('Token not found in response');
        }
      }),
      catchError(error => throwError(error))
    );
  }
  

  getCurrentUser(): AccountDto | null {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = this.jwtHelper.decodeToken(token);
      const user: AccountDto = {
        UserName: tokenPayload.given_name,
        Email: tokenPayload.email,
        Role: tokenPayload.role || 'User' 
      };
      return user;
    }
    return null;
  }

  private handleAuthentication(response: AccountDto): void {
    if (response.Token) {
      localStorage.setItem('token', response.Token);
      localStorage.setItem('role', response.Role || ''); // Ensure role is not null
    }
  }
}
