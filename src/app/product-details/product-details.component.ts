import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cart, product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productData: undefined | product;
  productQuantity: number = 1;
  removeCart = false;
  cartData: product | undefined;

  constructor(private activeRoute: ActivatedRoute, private productService: ProductService) { }

  ngOnInit(): void {
    let productIdStr = this.activeRoute.snapshot.paramMap.get('productId');
    let productIdNum = productIdStr ? +productIdStr : undefined;

    if (productIdNum !== undefined) {
      this.productService.getProduct(productIdNum).subscribe((result) => {
        this.productData = result;
        let cartData = localStorage.getItem('localCart');
        if (cartData) {
          let items = JSON.parse(cartData);
          items = items.filter((item: product) => productIdNum === item.id);
          if (items.length) {
            this.removeCart = true;
          } else {
            this.removeCart = false;
          }
        }

        let user = localStorage.getItem('user');
        if (user) {
          let userId = JSON.parse(user).id;
          this.productService.getCartList(userId);

          this.productService.cartData.subscribe((result) => {
            let item = result.find((item: product) => productIdNum === item.productId)?.[0];
            if (item) {
              this.cartData = item;
              this.removeCart = true;
            }
          });
        }
      });
    }
  }

  handleQuantity(val: string) {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }

  addToCart() {
    if (this.productData) {
      this.productData.quantity = this.productQuantity;
      if (!localStorage.getItem('user')) {
        this.productService.localAddToCart(this.productData);
        this.removeCart = true;
      } else {
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        let cartData: cart = {
          ...this.productData,
          productId: this.productData.id,
          userId
        }
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

  removeToCart(productId: number) {
    if (!localStorage.getItem('user')) {
      this.productService.removeItemFromCart(productId);
    } else {
      this.cartData && this.productService.removeToCart(this.cartData.id)
        .subscribe((result) => {
          let user = localStorage.getItem('user');
          let userId = user && JSON.parse(user).id;
          this.productService.getCartList(userId);
        });
    }
    this.removeCart = false;
  }
}
