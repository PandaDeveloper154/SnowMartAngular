import { Component, AfterViewInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  popularProducts: product[] | undefined;
  trendyProducts: product[] | undefined;
  searchtext: string = '';

  constructor(private productService: ProductService) { }

  ngAfterViewInit(): void {
    this.productService.getAllProducts().subscribe((data) => {
      this.popularProducts = data;
    });
  }
}
