import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { cart, order } from '../data-type';
import { ProductService } from '../services/product.service';
import { cart, order } from '../data-type';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice: number | undefined;
  cartData: cart[] | undefined;
  orderMsg: string | undefined;
  checkoutForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private product: ProductService,
    private router: Router
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.initForm();
    const user = localStorage.getItem('user');
    const userId = user && JSON.parse(user).id;
    if (userId) {
      this.loadCart(userId);
    }
    this.loadCartData();
  }

  initForm(): void {
    this.checkoutForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      contact: ['', Validators.required]
    });
  }

  loadCart(userId: number): void {
    this.product.currentCart(userId).subscribe((result) => {
      let price = 0;
      this.cartData = result;
      result.forEach((item) => {
        if (item.quantity) {
          price += +item.price * +item.quantity;
        }
      });
      this.totalPrice = price + (price / 10) + 100 - (price / 10);
    });
  loadCartData(): void {
    this.productService.currentCart()
      .pipe(
        catchError(error => {
          console.error('Error loading cart data:', error);
          return throwError('Error loading cart data. Please try again later.');
        })
      )
      .subscribe((result) => {
        let price = 0;
        this.cartData = result;
        result.forEach((item) => {
          if (item.quantity) {
            price = price + (+item.price * +item.quantity);
          }
        });
        this.totalPrice = price + (price / 10) + 100 - (price / 10);
      });
  }

  orderNow(): void {
    const user = localStorage.getItem('user');
    const userId = user && JSON.parse(user).id;
    if (this.totalPrice && this.checkoutForm.valid && userId) {
      const orderData: order = {
        ...this.checkoutForm.value,
        totalPrice: this.totalPrice,
        userId,
        id: undefined
      };
      this.cartData?.forEach((item) => {
        setTimeout(() => {
          item.id && this.productService.deleteCartItems(item.id);
        }, 700);
      });

      this.productService.orderNow(orderData)
        .pipe(
          catchError(error => {
            console.error('Error placing order:', error);
            return throwError('Error placing order. Please try again later.');
          })
        )
        .subscribe((result) => {
          if (result) {
            this.orderMsg = "Order has been placed";
            setTimeout(() => {
              this.orderMsg = undefined;
            }, 4000);
          }
        });
    }
  }
}