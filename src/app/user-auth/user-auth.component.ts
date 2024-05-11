import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css'],
})
export class UserAuthComponent implements OnInit {
  showLogin: boolean = true;
  authError: string = "";
  userLoginForm!: FormGroup;
  userSignUpForm!: FormGroup;

  constructor(private user: UserService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.userLoginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]]
    });

    this.userSignUpForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]]
    });
  }

  signUp(): void {
    if (this.userSignUpForm.valid) {
      const signUpData = this.userSignUpForm.value;
      this.user.userSignUp(signUpData);
    }
  }

  login(): void {
    if (this.userLoginForm.valid) {
      const loginData = this.userLoginForm.value;
      this.user.userLogin(loginData);
      this.user.invalidUserAuth.subscribe((result) => {
        if (result) {
          this.authError = "User not found";
        }
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
