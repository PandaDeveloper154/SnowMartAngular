import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  adminName: string = '';
  userName: string = "";
  cartItems = 0;

  constructor(private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    this.updateHeader(); 
  }

  updateHeader(): void {
    console.log("Updating header...");

    if (localStorage.getItem('admin')) {
      let adminStore = localStorage.getItem('admin');
      let adminData = adminStore && JSON.parse(adminStore);
      if (adminData && adminData.userName) {
        this.adminName = adminData.userName;
      }
      this.menuType = 'admin';
    } else if (localStorage.getItem('user')) {
      let userStore = localStorage.getItem('user');
      let userData = userStore && JSON.parse(userStore);
      this.userName = userData.name;
      this.menuType = 'user';
    } else {
      this.menuType = 'default';
    }

    console.log("Menu type:", this.menuType);

    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData).length
    }
    this.productService.cartData.subscribe((items: any[]) => {
      this.cartItems = items.length;
    });
  }

  logout() {
    localStorage.removeItem('admin');
    localStorage.removeItem('role');
    this.updateHeader(); 
    this.router.navigate(['/']);
    this.productService.cartData.next([]);
  }

  userLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.updateHeader(); 
    this.router.navigate(['/user-auth']);
    this.productService.cartData.next([]);
  }

  redirectToDetails(id: number) {
    this.router.navigate(['/details/' + id]);
  }
}
