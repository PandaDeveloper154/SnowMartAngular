import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './user/home/home.component';
import { ProductDetailsComponent } from './user/product-details/product-details.component';
import { CartPageComponent } from './user/cart-page/cart-page.component';
import { CheckoutComponent } from './user/checkout/checkout.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminAddProductComponent } from './admin/admin-add-product/admin-add-product.component';
import { AdminUpdateComponent } from './admin/admin-update/admin-update.component';
import { AuthGuard } from './guard/auth.guard';
import { AuthComponent } from './auth/auth.component';
import { AdminGuard } from './guard/admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin-home', component: AdminHomeComponent, canActivate: [AdminGuard] },
  { path: 'admin-add-product', component: AdminAddProductComponent,canActivate: [AdminGuard]},
  { path: 'admin-update-product/:id', component: AdminUpdateComponent,canActivate: [AdminGuard] },
  { path: 'details/:productId', component: ProductDetailsComponent },
  { path: 'user-auth', component: AuthComponent },
  { path: 'cart-page', component: CartPageComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'my-orders', component: MyOrdersComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
