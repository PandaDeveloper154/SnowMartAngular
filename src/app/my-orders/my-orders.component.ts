import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Subscription } from 'rxjs';
import { order } from '../data-type';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  orderData: order[] | undefined;
  private subscription: Subscription | undefined;
  userId: number | undefined; // Assuming you have the userId available

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    if (this.userId) {
      this.getOrderList(this.userId);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  cancelOrder(orderId: number | undefined): void {
    if (orderId) {
      this.productService.cancelOrder(orderId).subscribe((result) => {
        if (result) {
          this.getOrderList(this.userId); // Update order list after canceling order
        }
      });
    }
  }

  getOrderList(userId: number | undefined): void {
    if (userId) {
      this.subscription = this.productService.orderList(userId).subscribe((result) => {
        this.orderData = result;
      });
    }
  }
}
