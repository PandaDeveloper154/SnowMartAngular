import { Component, OnInit } from '@angular/core';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

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
      this.popularProducts = data;
    })

  }
}
