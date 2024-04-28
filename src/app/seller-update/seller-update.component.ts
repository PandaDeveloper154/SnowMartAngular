import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-seller-update',
  templateUrl: './seller-update.component.html',
  styleUrls: ['./seller-update.component.css']
})
export class SellerUpdateComponent implements OnInit {
  productData: undefined | product;
  productMessage: undefined | string;
  constructor(private router: ActivatedRoute, private product: ProductService) { }

  ngOnInit(): void {
    let productId = this.router.snapshot.paramMap.get('id');
    console.warn(productId);
    productId && this.product.getProduct(productId).subscribe((data) => {
      console.warn(data);
      this.productData = data;
    })
  }
  submit(data: product) {
    console.warn(data)
    if (this.productData) {
      data.id = this.productData.id;
    }
    this.product.updateProduct(data).subscribe((result) => {
      if (result) {
        this.productMessage = "Product has updated";
      }
    });
    setTimeout(() => {
      this.productMessage = undefined
    }, 3000)
  }

}
