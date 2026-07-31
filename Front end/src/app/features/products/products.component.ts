import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductService } from '../../core/services/products/product.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { Product } from '../../core/models/productsInter/product.interface';
import { FormsModule } from '@angular/forms';
import { SearchByTitelPipe } from '../../shared/pipes/search-by-titel-pipe';

@Component({
  selector: 'app-products',
  imports: [CardComponent, FormsModule, SearchByTitelPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  productSearch: string = '';

  allProductList: WritableSignal<Product[]> = signal<Product[]>([]);

  ngOnInit(): void {
    this.getAllProduct();
  }

  getAllProduct(): void {
    this.productService.getAllPoducts().subscribe({
      next: (res) => {
        this.allProductList.set(res.products);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
