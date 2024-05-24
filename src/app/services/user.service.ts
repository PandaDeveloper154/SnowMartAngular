import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { login, signUp } from '../data-type';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7040/api/Account';
  invalidUserAuth = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

  userSignUp(user: signUp): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, { observe: 'response' }).pipe(
      map((response: any) => {
        if (response) {
          localStorage.setItem('user', JSON.stringify(response.body));
          this.router.navigate(['/']);
          return response.body;
        }
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  userLogin(data: login): Observable<any> {
    return this.http.get(`${this.apiUrl}/login?email=${data.email}&password=${data.password}`, { observe: 'response' }).pipe(
      map((response: any) => {
        if (response && response.body && response.body.length === 1) {
          localStorage.setItem('user', JSON.stringify(response.body[0]));
          this.router.navigate(['/']);
          this.invalidUserAuth.next(false);
          return response.body;
        } else {
          this.invalidUserAuth.next(true);
          return false;
        }
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  userAuthReload() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/']);
    }
  }
}
