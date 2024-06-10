import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { category, product } from '../../data-type';

@Component({
  selector: 'app-admin-update',
  templateUrl: './admin-update.component.html',
  styleUrls: ['./admin-update.component.css']
})
export class AdminUpdateComponent implements OnInit {
  productData: product | undefined;
  productMessage: string | undefined;
  updateForm: FormGroup;
  categories: category[] = [];
  selectedFile: File | null = null;
  productId: number | undefined;

  constructor(
    private router: ActivatedRoute,
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {
    this.updateForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      price: new FormControl('', [Validators.required]),
      categoryId: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]),
    });
  }

  ngOnInit(): void {
    this.fetchCategories();
    let productIdString = this.router.snapshot.paramMap.get('id');
    if (productIdString) {
      this.productId = parseInt(productIdString, 10);
      this.productService.getProduct(this.productId).subscribe((data) => {
        this.productData = data;
        this.updateForm.patchValue(data);
      });
    }
  }

  fetchCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  submit(): void {
    if (this.updateForm.valid && this.selectedFile && this.productId) { // Add check for productId
      const formData = new FormData();
      formData.append('file', this.selectedFile);
  
      const formValues = this.updateForm.value;
      formData.append('name', formValues.name);
      formData.append('price', formValues.price);
      formData.append('categoryId', formValues.categoryId);
      formData.append('color', formValues.color);
      formData.append('description', formValues.description);
      formData.append('image', this.selectedFile!.name);
  
      this.productService.updateProduct(this.productId, formData).subscribe((result) => { // Use this.productId
        if (result) {
          this.productMessage = "Product has been updated";
          setTimeout(() => {
            this.productMessage = undefined;
          }, 3000);
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
    console.log(this.selectedFile);
  }

}
