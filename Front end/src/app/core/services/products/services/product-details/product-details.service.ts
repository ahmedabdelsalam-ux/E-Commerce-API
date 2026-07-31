import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment.development';
import { ProductDetailsResponse } from '../../../../models/productsInter/product-detailsInter/product-details.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailsService {
  private readonly httpClient = inject(HttpClient);

  getOneProduct(id: string): Observable<ProductDetailsResponse> {
    return this.httpClient.get<ProductDetailsResponse>(`${environment.base_url}products/${id}`);
  }
}
