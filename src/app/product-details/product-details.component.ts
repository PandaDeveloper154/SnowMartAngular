import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { cart, product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  productData: product | undefined;
  productQuantity = 1;
  removeCart = false;
  cartData: product | undefined;
  private routeSubscription: Subscription | undefined;
  private cartSubscription: Subscription | undefined;

  constructor(
    private activeRoute: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.activeRoute.params.subscribe(params => {
      const productId = params['productId'];
      this.getProductDetails(productId);
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.cartSubscription?.unsubscribe();
  }

  private getProductDetails(productId: string | null): void {
    if (productId) {
      this.productService.getProduct(+productId).subscribe((result) => {
        this.productData = result;
        this.checkCartStatus(productId);
      });
    }
  }

  private checkCartStatus(productId: string): void {
    const cartData = localStorage.getItem('localCart');
    if (productId && cartData) {
      const items = JSON.parse(cartData);
      this.removeCart = items.some((item: product) => productId === item.id.toString());
    }

    const user = localStorage.getItem('user');
    if (user) {
      const userId = JSON.parse(user).id;
      this.cartSubscription = this.productService.cartData.subscribe((result) => {
        const item = result.find((item: product) => productId === item.productId?.toString());
        this.cartData = item;
        this.removeCart = !!item;
      });
      this.productService.getCartList(userId);
    }
  }

  handleQuantity(val: string): void {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }

  addToCart(): void {
    if (this.productData) {
      this.productData.quantity = this.productQuantity;
      if (!localStorage.getItem('user')) {
        this.productService.localAddToCart(this.productData);
        this.removeCart = true;
      } else {
        const user = JSON.parse(localStorage.getItem('user') || '');
        const userId = user.id;
        const cartData: cart = { ...this.productData, productId: this.productData.id, userId };
        delete cartData.id;
        this.productService.addToCart(cartData).subscribe((result) => {
          if (result) {
            this.productService.getCartList(userId);
            this.removeCart = true;
          }
        });
      }
    }
  }

  removeToCart(productId: number): void {
    if (!localStorage.getItem('user')) {
      this.productService.removeItemFromCart(productId);
    } else {
      this.cartData && this.productService.removeToCart(this.cartData.id).subscribe((result) => {
        const userId = JSON.parse(localStorage.getItem('user') || '').id;
        this.productService.getCartList(userId);
      });
    }
    this.removeCart = false;
  }
}
