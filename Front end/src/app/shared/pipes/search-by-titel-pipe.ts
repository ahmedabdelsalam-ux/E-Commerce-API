import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../core/models/productsInter/product.interface';

@Pipe({
  name: 'searchByTitel',
})
export class SearchByTitelPipe implements PipeTransform {
  transform(productList: Product[], word: string = ''): Product[] {
    if (!word.trim()) {
      return productList;
    }

    return productList.filter((item) => item.title.toLowerCase().includes(word.toLowerCase()));
  }
}
