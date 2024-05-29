import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './user/home/home.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminAddProductComponent } from './admin/admin-add-product/admin-add-product.component';
import { AdminUpdateComponent } from './admin/admin-update/admin-update.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductDetailsComponent } from './user/product-details/product-details.component';
import { FooterComponent } from './footer/footer.component';
import { CartPageComponent } from './user/cart-page/cart-page.component';
import { CheckoutComponent } from './user/checkout/checkout.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { FilterPipe } from './filter.pipe';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthComponent } from './auth/auth.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AdminHomeComponent,
    AdminAddProductComponent,
    AdminUpdateComponent,
    ProductDetailsComponent,
    FooterComponent,
    CartPageComponent,
    CheckoutComponent,
    MyOrdersComponent,
    FilterPipe,
    AuthComponent
  ],
  imports: [
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'),
        allowedDomains: ['localhost:7040'] 
      }
    }),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
