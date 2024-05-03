import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cart, login, product, signUp } from '../data-type';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css'],
})
export class UserAuthComponent implements OnInit {
  showLogin: boolean = true;
  authError: string = "";
  userLoginForm: FormGroup;
  userSignUpForm: FormGroup;

  constructor(
    private user: UserService,
    private product: ProductService,
    private formBuilder: FormBuilder
  ) {
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

  ngOnInit(): void {
    this.user.userAuthReload();
  }

  signUp(): void {
    if (this.userSignUpForm.valid) {
      const signUpData: signUp = this.userSignUpForm.value;
      this.user.userSignUp(signUpData);
    }
  }

  login(): void {
    if (this.userLoginForm.valid) {
      const loginData: login = this.userLoginForm.value;
      this.user.userLogin(loginData)
      this.user.invalidUserAuth.subscribe((result) => {
        if (result) {
          this.authError = "User not found"
        } else {
          this.localCartToRemoteCart();
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

  localCartToRemoteCart(): void {
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    if (data) {
      let cartDataList: product[] = JSON.parse(data);

      cartDataList.forEach((product: product, index) => {
        let cartData: cart = {
          ...product,
          productId: product.id,
          userId
        }
        delete cartData.id;
        setTimeout(() => {
          this.product.addToCart(cartData).subscribe((result) => {
            if (result) {
              console.warn("data is stored in DB");
            }
          })
        }, 500);
        if (cartDataList.length === index + 1) {
          localStorage.removeItem('localCart')
        }
      })
    }

    setTimeout(() => {
      this.product.getCartList(userId)
    }, 2000);
  }
}
