import { Component, AfterViewInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  popularProducts: undefined | product[];
  searchtext: string ='';
  constructor(private product: ProductService) { }

  ngOnInit(): void {
    this.product.getAllProducts().subscribe((data) => {
export class HomeComponent implements AfterViewInit {
  popularProducts: product[] | undefined;
  trendyProducts: product[] | undefined;
  searchtext: string = '';

  constructor(private productService: ProductService) { }

  ngAfterViewInit(): void {
    this.productService.popularProducts().subscribe((data) => {
      this.popularProducts = data;
    });

    this.productService.trendyProducts().subscribe((data) => {
      this.trendyProducts = data;
    });
  }
}
