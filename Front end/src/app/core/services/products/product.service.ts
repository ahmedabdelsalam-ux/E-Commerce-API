import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ProductResponse } from '../../models/productsInter/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly httpClient = inject(HttpClient);

  getAllPoducts(): Observable<ProductResponse> {
    return this.httpClient.get<ProductResponse>(environment.base_url + 'products');
  }
}
