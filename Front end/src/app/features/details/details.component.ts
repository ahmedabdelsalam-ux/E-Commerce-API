import { ProductDetails } from './../../core/models/productsInter/product-detailsInter/product-details.interface';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailsService } from '../../core/services/products/services/product-details/product-details.service';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly productDetailsService = inject(ProductDetailsService);
  private readonly activatedRoute = inject(ActivatedRoute);

  productDetailsData: WritableSignal<ProductDetails> = signal({} as ProductDetails);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        if (id) {
          this.getProductDetails(id);
        }
      },
    });
  }

  getProductDetails(id: string): void {
    this.productDetailsService.getOneProduct(id).subscribe({
      next: (res) => {
        this.productDetailsData.set(res.product);
      },
    });
  }
}
