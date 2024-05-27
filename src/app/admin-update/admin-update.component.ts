import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-admin-update',
  templateUrl: './admin-update.component.html',
  styleUrls: ['./admin-update.component.css']
})
export class AdminUpdateComponent implements OnInit {
  productData: product | undefined;
  productMessage: string | undefined;
  updateForm: FormGroup;
  categories: string[] = ['Laptop', 'Phone', 'Tablet']; // Example array of categories

  constructor(
    private router: ActivatedRoute,
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {
    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      categoryId: ['', Validators.required], // Changed formControlName to category
      color: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    let productIdString = this.router.snapshot.paramMap.get('id');
    if (productIdString) {
      let productId = parseInt(productIdString, 10); // Convert string to number
      this.productService.getProduct(productId).subscribe((data) => {
        this.productData = data;
        this.updateForm.patchValue(data);
      });
    }
  }

  submit(): void {
    if (this.updateForm.valid) {
      if (this.productData) {
        const updatedProduct: product = { ...this.productData, ...this.updateForm.value };
        this.productService.updateProduct(updatedProduct).subscribe((result) => {
          if (result) {
            this.productMessage = "Product has been updated";
            setTimeout(() => {
              this.productMessage = undefined;
            }, 3000);
          }
        });
      }
    }
  }
}
