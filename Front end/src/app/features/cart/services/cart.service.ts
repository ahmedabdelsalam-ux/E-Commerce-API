import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);

  // Add Product
  addProductToCart(id: string): Observable<any> {
    return this.httpClient.post(environment.base_url + `cart/${id}`, {});
  }

  // Get Cart
  getLogedUserCart(): Observable<any> {
    return this.httpClient.get(environment.base_url + 'cart');
  }

  // Increase Quantity
  updateCartQuantity(id: string): Observable<any> {
    return this.httpClient.patch(environment.base_url + `cart/${id}`, {});
  }

  // Remove Product
  removeProductFromCart(id: string): Observable<any> {
    return this.httpClient.delete(environment.base_url + `cart/${id}`);
  }

  // Clear Cart
  removeAllCart(): Observable<any> {
    return this.httpClient.delete(environment.base_url + 'cart');
  }

  // Checkout
  checkOutSession(cartId: string, body: object): Observable<any> {
    return this.httpClient.post<any>(`${environment.base_url}checkout/${cartId}`, body);
  }
}
