import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  showLogin: boolean = true;
  authError: string = "";
  loginForm!: FormGroup;
  signUpForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]]
    });

    this.signUpForm = this.formBuilder.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]]
    });
  }

  signUp(): void {
    if (this.signUpForm.valid) {
      const signUpData = this.signUpForm.value;
      this.authService.signUp(signUpData).subscribe(response => {
        console.log('Sign up successful:', response);
        this.router.navigate(['/']);
      }, error => {
        console.error('Sign up error:', error);
        this.authError = "Error occurred during sign up.";
      });
    }
  }

  login(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.authError = "";
      this.authService.login(loginData).subscribe(response => {
        console.log('Login successful:', response);
        if (response.Role === 'Admin') {
          this.router.navigate(['/admin-home']);
        } else {
          this.router.navigate(['/']);
        }
      }, error => {
        console.error('Login error:', error);
        this.authError = "Email or password is not correct";
      });
    }
  }

  openSignUp(): void {
    this.showLogin = false;
  }

  openLogin(): void {
    this.showLogin = true;
  }
}
