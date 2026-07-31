import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Category } from '../../core/models/categoriesInter/categories.interface';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  categorieList: WritableSignal<Category[]> = signal<Category[]>([]);

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        this.categorieList.set(res.categories);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
