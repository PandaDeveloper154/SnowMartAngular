import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { signUp } from '../data-type';
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
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.sellerLoginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.authReload(false); // Assuming it's for user authentication
  }

  signUp(): void {
    if (this.sellerSignUpForm.valid) {
      const signUpData: signUp = this.sellerSignUpForm.value;
      console.log('Sign Up Data:', signUpData);
      this.authService.signUp(signUpData, false).subscribe(response => {
        console.log('Sign up successful:', response);
        this.router.navigate(['/user-home']); // Redirect to user home after successful sign up
      }, error => {
        console.error('Sign up error:', error);
        this.authError = "Error occurred during sign up.";
      });
    }
  }

  login(): void {
    if (this.sellerLoginForm.valid) {
      const loginData: signUp = this.sellerLoginForm.value;
      this.authError = "";
      this.authService.login(loginData, false).subscribe(response => {
        console.log('Login successful:', response);
        this.router.navigate(['/user-home']); // Redirect to user home after successful login
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
