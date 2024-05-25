import { Component, OnDestroy } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Subscription } from 'rxjs';
import { order } from '../data-type';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnDestroy {
  orderData: order[] | undefined;
  private subscription: Subscription | undefined;

  orderData: order[] | undefined;
  userId: number | undefined; // Assuming you have the userId available

  constructor(private product: ProductService) { }

  ngOnInit(): void {
    // Assuming you have the userId available before calling getOrderList
    this.getOrderList(this.userId);
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.subscription = this.productService.orderList().subscribe((result) => {
      this.orderData = result;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  cancelOrder(orderId: number | undefined) {
    orderId && this.productService.cancelOrder(orderId).subscribe((result) => {
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
        this.orderList();
      }
    });
  }

  orderList() {
    this.productService.orderList().subscribe((result) => {
      this.orderData = result;
    });
  }
}
