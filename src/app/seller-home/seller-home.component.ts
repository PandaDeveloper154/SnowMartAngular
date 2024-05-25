import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
})
export class SellerHomeComponent implements OnInit {
  productList: product[] | undefined;
  productMessage: string | undefined;
  icon = faTrash; // Define the icon property
  iconEdit = faEdit; // Define the iconEdit property

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProductList();
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id)
      .pipe(
        catchError(error => {
          console.error('Error deleting product:', error);
          this.productMessage = 'Error deleting product. Please try again later.';
          return throwError(error);
        })
      )
      .subscribe((result) => {
        if (result) {
          this.productMessage = 'Product is deleted';
          this.loadProductList();
        }
      });
    setTimeout(() => {
      this.productMessage = undefined;
    }, 3000);
  }

  loadProductList(): void {
    this.productService.getAllProducts()
      .pipe(
        catchError(error => {
          console.error('Error loading product list:', error);
          this.productMessage = 'Error loading product list. Please try again later.';
          return throwError(error);
        })
      )
      .subscribe((result) => {
        if (result) {
          this.productList = result;
        }
      });
  }
}
