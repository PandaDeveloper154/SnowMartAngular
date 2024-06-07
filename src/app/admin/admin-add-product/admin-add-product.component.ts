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
  selectedFile: File | null=null;

  constructor(private fb: FormBuilder, private productService: ProductService) { }

  ngOnInit(): void {
    this.initForm();
    this.productService.getCategories().subscribe(categories=>{
      this.categories = categories;

    });
  }

  initForm(): void {
    this.addProductForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      price: new FormControl('',[ Validators.required]),
      categoryId: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]),
    });
  }

  submit(): void {
    if (this.addProductForm.valid && this.selectedFile) {
      const productData = this.addProductForm.value; // Lấy thông tin sản phẩm từ form
  
      const formData = new FormData();
      formData.append('image', this.selectedFile as Blob);
  
      // Gửi thông tin sản phẩm dưới dạng JSON và hình ảnh dưới dạng FormData
      this.productService.addProduct(productData, formData).subscribe((result) => {
        if (result) {
          this.addProductMessage = "Product is successfully added";
          setTimeout(() => (this.addProductMessage = undefined), 3000);
          this.addProductForm.reset();
        }
      }, (error) => {
        console.error("Failed to add product:", error); 
      });
    }
  }
  


  onFileSelected(event: Event): void { 
    const input = event.target as HTMLInputElement; 
    if (input.files && input.files.length > 0) { 
      this.selectedFile = input.files[0]; 
    } 
  }
}
