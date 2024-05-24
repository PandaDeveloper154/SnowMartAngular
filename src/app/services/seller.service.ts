import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { login, signUp } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private apiUrl = 'https://localhost:7040/api/Account';
  isSellerLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  userSignUp(data: signUp): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data, { observe: 'response' }).pipe(
      map((response: any) => {
        if (response) {
          localStorage.setItem('seller', JSON.stringify(response.body));
          this.isSellerLoggedIn.next(true);
          return response.body;
        }
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  
  reloadSeller() {
    if (localStorage.getItem('seller')) {
      // Assuming 'seller-home' is a valid route
      window.location.href = '/seller-home'; // Redirect to seller-home
    }
  }

  userLogin(data: login): Observable<any> {
    return this.http.get(`${this.apiUrl}/login?email=${data.email}&password=${data.password}`, { observe: 'response' }).pipe(
      map((response: any) => {
        if (response && response.body && response.body.length === 1) {
          localStorage.setItem('seller', JSON.stringify(response.body));
          this.isSellerLoggedIn.next(true);
          return response.body;
        } else {
          return false; // Indicate login failed
        }
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
