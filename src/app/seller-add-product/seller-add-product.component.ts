import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css']
})
export class SellerAddProductComponent implements OnInit {
  addProductForm!: FormGroup;
  addProductMessage: string | undefined;

  constructor(private fb: FormBuilder, private productService: ProductService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      color: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.addProductForm.valid) {
      const data: product = this.addProductForm.value;
      this.productService.addProduct(data).subscribe((result) => {
        if (result) {
          this.addProductMessage = "Product is successfully added";
          setTimeout(() => (this.addProductMessage = undefined), 3000);
          this.addProductForm.reset();
        }
      });
    }
  }
}
