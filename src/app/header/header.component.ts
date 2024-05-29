import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  userName: string = "";
  cartItems = 0;

  constructor(private authService: AuthService, private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    this.updateHeader();
  }

  updateHeader(): void {
    console.log("Updating header...");
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getCurrentUser();
      if (user && user.Role === 'Admin') {
        this.menuType = 'admin';
      } else {
        this.menuType = 'user';
        this.userName = user?.UserName || "";
      }
    } else {
      this.menuType = 'default';
    }

    console.log("Menu type:", this.menuType);

    const cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData).length
    }
    this.productService.cartData.subscribe((items: any[]) => {
      this.cartItems = items.length;
    });
  }

  logout() {
    this.authService.logout();
    this.updateHeader(); 
    this.router.navigate(['/']);
    this.productService.cartData.next([]);
  }

  redirectToDetails(id: number) {
    this.router.navigate(['/details/' + id]);
  }
}
