import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { cart, category, order, product } from '../data-type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  cartData = new EventEmitter<any[]>();
  private apiUrl = 'https://localhost:7040/api';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error(error);
    return throwError(error);
  }

  // Product methods
  getAllProducts(): Observable<product[]> {
    return this.http.get<product[]>(`${this.apiUrl}/Product`)
      .pipe(
        tap(_ => console.log('Fetched all products')),
        catchError(this.handleError)
      );
  }

  getCategories(): Observable<category[]> {
    return this.http.get<category[]>(`${this.apiUrl}/Category`)
      .pipe(
        tap(_ => console.log('Fetched all categories')),
        catchError(this.handleError)
      );
  }

  getProduct(id: number): Observable<product> {
    const url = `${this.apiUrl}/Product/${id}`;
    return this.http.get<product>(url)
      .pipe(
        tap(_ => console.log(`Fetched product with ID=${id}`)),
        catchError(this.handleError)
      );
  }

  deleteProduct(id: number): Observable<any> {
    const url = `${this.apiUrl}/Product/${id}`;
    return this.http.delete(url, this.httpOptions)
      .pipe(
        tap(_ => console.log(`Deleted product with ID=${id}`)),
        catchError(this.handleError)
      );
  }

  updateProduct(product: product): Observable<any> {
    const url = `${this.apiUrl}/Product/${product.id}`;
    return this.http.put(url, product, this.httpOptions)
      .pipe(
        tap(_ => console.log(`Updated product with ID=${product.id}`)),
        catchError(this.handleError)
      );
  }

  addProduct(product: FormData): Observable<product> {
    return this.http.post<product>(`${this.apiUrl}/Product`, product)
      .pipe(
        tap((newProduct: product) => console.log(`Added product with ID=${newProduct.id}`)),
        catchError(this.handleError)
      );
  }

  uploadFile(formData: FormData): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/Product/upload`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  searchProducts(query: string): Observable<product[]> {
    return this.http.get<product[]>(`${this.apiUrl}/Product?categoryName=${query}`);
  }

  // Cart methods
  localAddToCart(data: product) {
    let cartData = localStorage.getItem('localCart');
    let items: product[] = cartData ? JSON.parse(cartData) : [];
    items.push(data);
    localStorage.setItem('localCart', JSON.stringify(items));
  }

  removeItemFromCart(productId: number) {
    let cartData = localStorage.getItem('localCart');
    let items: product[] = cartData ? JSON.parse(cartData) : [];
    items = items.filter(item => item.id !== productId);
    localStorage.setItem('localCart', JSON.stringify(items));
  }

  addToCart(cartData: cart): Observable<any> {
    return this.http.post(`${this.apiUrl}/CartItem`, cartData, this.httpOptions)
      .pipe(
        tap(_ => console.log('Added to cart')),
        catchError(error => {
          console.error('Error adding to cart:', error);
          return throwError(error);
        })
      );
  }

  getCartList(userId: number): Observable<product[]> {
    return this.http.get<product[]>(`${this.apiUrl}/CartItem?userId=${userId}`, { observe: 'response' })
      .pipe(
        map((response) => response.body as product[]),
        tap(_ => console.log('Fetched cart list')),
        catchError(this.handleError)
      );
  }

  currentCart(userId: number): Observable<cart[]> {
    return this.http.get<cart[]>(`${this.apiUrl}/CartItem?userId=${userId}`).pipe(
      catchError((error) => {
        console.error('Error fetching current cart:', error);
        throw error;
      })
    );
  }

  removeToCart(cartId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/CartItem/${cartId}`)
      .pipe(
        tap(_ => console.log(`Removed cart item with ID=${cartId}`)),
        catchError(this.handleError)
      );
  }

  deleteCartItems(cartId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/CartItem/${cartId}`)
      .pipe(
        tap(_ => console.log(`Deleted cart item with ID=${cartId}`)),
        catchError(this.handleError)
      );
  }

  // Order methods
  orderNow(data: order): Observable<any> {
    return this.http.post(`${this.apiUrl}/Order`, data, this.httpOptions)
      .pipe(
        tap(_ => console.log('Placed order')),
        catchError(this.handleError)
      );
  }

  orderList(userId: number): Observable<order[]> {
    return this.http.get<order[]>(`${this.apiUrl}/Order?userId=${userId}`)
      .pipe(
        tap(_ => console.log('Fetched order list')),
        catchError(this.handleError)
      );
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Order/${orderId}`)
      .pipe(
        tap(_ => console.log(`Cancelled order with ID=${orderId}`)),
        catchError(this.handleError)
      );
  }
}
