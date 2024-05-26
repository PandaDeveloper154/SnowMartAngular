import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { login, signUp, product, cart } from '../data-type';
import { Router } from '@angular/router';

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

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userLoginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]]
    });

    this.userSignUpForm = this.formBuilder.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]]
    });

    this.authService.authReload(); // Kiểm tra trạng thái đăng nhập khi component được khởi tạo
  }

  signUp(): void {
    if (this.userSignUpForm.valid) {
      const signUpData: signUp = this.userSignUpForm.value;
      this.authService.signUp(signUpData).subscribe(response => {
        console.log('Sign up successful:', response);
      }, error => {
        console.error('Sign up error:', error);
        if (error === 'Token not found') {
          this.authError = "Token not found in localStorage";
        } else {
          this.authError = "Error occurred during sign up.";
        }
      });
    }
  }

  login(): void {
    if (this.userLoginForm.valid) {
      const loginData: login = this.userLoginForm.value;
      this.authError = "";
      this.authService.login(loginData).subscribe(response => {
        console.log('Login successful:', response);
        this.localCartToRemoteCart();
        this.router.navigate(['/']); // Navigate to home page after successful login
      }, error => {
        console.error('Login error:', error);
        this.authError = "User not found";
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
    const data = localStorage.getItem('localCart');
    const user = localStorage.getItem('user');
    const userId = user && JSON.parse(user).id;
    if (data) {
      const cartDataList: product[] = JSON.parse(data);

      cartDataList.forEach((product: product, index) => {
        const cartData: cart = {
          ...product,
          productId: product.id,
          userId
        }
        delete cartData.id;
        setTimeout(() => {
          this.productService.addToCart(cartData).subscribe((result) => {
            if (result) {
              console.warn("data is stored in DB");
            }
          });
        }, 500);
        if (cartDataList.length === index + 1) {
          localStorage.removeItem('localCart');
        }
      });
    }

    setTimeout(() => {
      this.productService.getCartList(userId).subscribe();
    }, 2000);
  }
}