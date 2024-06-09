import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { category, product } from '../../data-type';

@Component({
  selector: 'app-admin-add-product',
  templateUrl: './admin-add-product.component.html',
  styleUrls: ['./admin-add-product.component.css']
})
export class AdminAddProductComponent implements OnInit {
  addProductForm!: FormGroup;
  addProductMessage: string | undefined;
  categories: category[] = [];
  selectedFile: File | null = null;
  uploadResponse: string = '';

  constructor(private fb: FormBuilder, private productService: ProductService) { }

  ngOnInit(): void {
    this.initForm();
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  initForm(): void {
    this.addProductForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      price: new FormControl('', [Validators.required]),
      categoryId: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]),
    });
  }

  submit(): void {
    if (this.addProductForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.productService.uploadFile(formData).subscribe(
        (response) => {
          const formValues = this.addProductForm.value;
          formData.append('name', formValues.name);
          formData.append('price', formValues.price);
          formData.append('categoryId', formValues.categoryId);
          formData.append('color', formValues.color);
          formData.append('description', formValues.description);
          formData.append('image', this.selectedFile!.name);

          this.productService.addProduct(formData).subscribe((result) => {
            if (result) {
              this.addProductMessage = "Product is successfully added";
              setTimeout(() => (this.addProductMessage = undefined), 3000);
              this.addProductForm.reset();
            }
          }, (error) => {
            console.error("Failed to add product:", error);
          });
        },
        (error) => {
          console.error("Failed to upload file:", error);
        }
      );
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
