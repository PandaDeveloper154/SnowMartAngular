import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { login, signUp } from '../data-type';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  isLoginErrror = new EventEmitter<boolean>(false)

  constructor(private http: HttpClient, private router: Router) { }
  userSignUp(data: signUp) {
    this.http.post('http://localhost:3000/seller', data,
      { observe: 'response' })
      .subscribe((result) => {
        console.warn(result)

        if (result) {
          localStorage.setItem('seller', JSON.stringify(result.body))
          this.router.navigate(['seller-home'])
        }
      });
  }
  reloadSeller() {
    if (localStorage.getItem('seller')) {
      this.isSellerLoggedIn.next(true);
      this.router.navigate(['seller-home']);
    }
  }
  userLogin(data: login) {
    console.warn(data);
    // Gọi API để đăng nhập
    this.http.get(
      `http://localhost:3000/seller?email=${data.email}&password=${data.password}`,
      { observe: 'response' })
      .subscribe((result: any) => {
        console.warn(result);

        // Kiểm tra kết quả đăng nhập
        if (result && result.body && result.body.length) {
          console.warn("User Logged in!");

          // Lưu thông tin đăng nhập vào localStorage
          localStorage.setItem(`seller`, JSON.stringify(result.body));

          // Chuyển hướng đến trang home sau khi đăng nhập thành công
          this.router.navigate([`seller-home`]);
        } else {
          console.warn("Login failed");
          this.isLoginErrror.emit(true)
        }
      });
  }

}
