import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { login, signUp } from '../data-type';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})
export class SellerAuthComponent implements OnInit {
  sellerSignUpForm: FormGroup;
  sellerLoginForm: FormGroup;
  showLogin = false;
  authError: string = "";

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    this.sellerSignUpForm = this.formBuilder.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.sellerLoginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.authReload(); // Assuming it's for user authentication
  }

  signUp(): void {
    if (this.sellerSignUpForm.valid) {
      const signUpData: signUp = this.sellerSignUpForm.value;
      this.authService.signUp(signUpData).subscribe(response => {
        console.log('Sign up successful:', response);
      }, error => {
        console.error('Sign up error:', error);
        this.authError = "Error occurred during sign up.";
      });
    }
  }

  login(): void {
    if (this.sellerLoginForm.valid) {
      const loginData: login = this.sellerLoginForm.value;
      this.authError = "";
      this.authService.login(loginData).subscribe(response => {
        console.log('Login successful:', response);
        this.router.navigate(['/seller-home']); // Redirect to user home after successful login
      }, error => {
        console.error('Login error:', error);
        this.authError = "Email or password is not correct";
      });
    }
  }

  openLogin(): void {
    this.showLogin = true;
  }

  openSignUp(): void {
    this.showLogin = false;
  }
}