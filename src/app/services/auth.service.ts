import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { login, signUp } from '../data-type';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7040/api/Account';
  private isUserLoggedIn = new BehaviorSubject<boolean>(false);
  private isSellerLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

  signUp(data: signUp, isSeller: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data, { observe: 'response' }).pipe(
      map((response: any) => {
        if (response) {
          const localStorageKey = isSeller ? 'seller' : 'user';
          localStorage.setItem(localStorageKey, JSON.stringify(response.body));
          isSeller ? this.isSellerLoggedIn.next(true) : this.isUserLoggedIn.next(true);
          return response.body;
        }
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  login(data: login, isSeller: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/login?email=${data.email}&password=${data.password}`, { observe: 'response' }).pipe(
      map((response: any) => {
        if (response && response.body && response.body.length === 1) {
          const localStorageKey = isSeller ? 'seller' : 'user';
          localStorage.setItem(localStorageKey, JSON.stringify(response.body));
          isSeller ? this.isSellerLoggedIn.next(true) : this.isUserLoggedIn.next(true);
          return response.body;
        } else {
          return false; 
        }
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  authReload(isSeller: boolean) {
    const localStorageKey = isSeller ? 'seller' : 'user';
    if (localStorage.getItem(localStorageKey)) {
      this.router.navigate([isSeller ? '/seller-home' : '/user-home']);
    }
  }

  isLoggedIn(isSeller: boolean): BehaviorSubject<boolean> {
    return isSeller ? this.isSellerLoggedIn : this.isUserLoggedIn;
  }

  logout(isSeller: boolean) {
    const localStorageKey = isSeller ? 'seller' : 'user';
    localStorage.removeItem(localStorageKey);
    isSeller ? this.isSellerLoggedIn.next(false) : this.isUserLoggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
