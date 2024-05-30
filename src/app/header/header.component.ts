import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  userName: string = "";
  cartItems = 0;
  searchResult: undefined | product[];

  constructor(private authService: AuthService, private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    this.authService.isUserLoggedIn.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.updateHeader();
      } else {
        this.menuType = 'default';
        this.userName = '';
        this.cartItems = 0;
      }
    });
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
  searchProduct(query:KeyboardEvent){
    if(query){
      const element = query.target as HTMLInputElement;
      this.productService.searchProducts(element.value).subscribe((result)=>{
        if(result.length>5){
          result.length=length
        }
        this.searchResult=result;
      })
    }
  }
  hideSearch(){
    this.searchResult=undefined
  }
  submitSearch(val:string){
    console.warn(val)
  this.router.navigate([`search/${val}`]);
  }

  redirectToDetails(id: number) {
    this.router.navigate(['/details/' + id]);
  }
}
