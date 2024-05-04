
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellerService } from '../services/seller.service';
import { Router } from '@angular/router';
import { signUp } from '../data-type';

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

  constructor(private seller: SellerService, private router: Router, private formBuilder: FormBuilder) {
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
    this.seller.reloadSeller();
  }
  signUp(): void {
    if (this.sellerSignUpForm.valid) {
      const signUpData: signUp = this.sellerSignUpForm.value;
      console.log('Sign Up Data:', signUpData); // Log form values
      this.seller.userSignUp(signUpData);
    }
  }
  

  login(): void {
    if (this.sellerLoginForm.valid) {
      const loginData: signUp = this.sellerLoginForm.value;
      this.authError = "";
      this.seller.userLogin(loginData);
      this.seller.isLoginError.subscribe((isError) => {
        if (isError) {
          this.authError = "Email or password is not correct";
        }
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
