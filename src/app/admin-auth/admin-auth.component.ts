import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { login } from '../data-type';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-auth',
  templateUrl: './admin-auth.component.html',
  styleUrls: ['./admin-auth.component.css']
})
export class AdminAuthComponent implements OnInit {
  adminLoginForm: FormGroup;
  authError: string = "";

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    this.adminLoginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Không cần gọi hàm authReload() ở đây, vì nó sẽ được gọi trong hàm login()
  }

  login(): void {
    if (this.adminLoginForm.valid) {
      const loginData: login = this.adminLoginForm.value;
      this.authError = "";
      this.authService.login(loginData).subscribe(response => {
        console.log('Login successful:', response);
        // Kiểm tra trạng thái đăng nhập và chuyển hướng
        this.authService.authReload();
        if (response.role === 'Admin') {
          this.router.navigate(['/admin-home']);
        } else {
          this.router.navigate(['/']); // Chuyển hướng về trang chính nếu không phải là admin
        } // Chuyển hướng đến trang quản lý admin sau khi đăng nhập thành công
      }, error => {
        console.error('Login error:', error);
        this.authError = "Email or password is not correct";
      });
    }
  }
}
