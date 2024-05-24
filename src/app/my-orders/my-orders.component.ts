import { Component, OnInit } from '@angular/core';
import { order } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  orderData: order[] | undefined;
  userId: number | undefined; // Assuming you have the userId available

  constructor(private product: ProductService) { }

  ngOnInit(): void {
    // Assuming you have the userId available before calling getOrderList
    this.getOrderList(this.userId);
  }

  cancelOrder(orderId: number | undefined) {
    orderId && this.product.cancelOrder(orderId).subscribe((result) => {
      if (result) {
        this.getOrderList(this.userId); // Update order list after canceling order
      }
    });
  }

  getOrderList(userId: number | undefined) {
    if (userId) {
      this.product.orderList(userId).subscribe((result) => {
        this.orderData = result;
      });
    }
  }
}
