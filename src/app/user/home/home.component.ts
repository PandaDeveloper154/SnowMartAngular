import { Component, AfterViewInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { product } from '../../data-type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  popularProducts: product[] | undefined;
  searchtext: string = '';
//   pageNumber: number = 1;
// totalPages: number = 1;


  constructor(private productService: ProductService) { }

  ngAfterViewInit(): void {
    this.productService.getAllProducts().subscribe((data) => {
      this.popularProducts = data;
    });
  
  }}
