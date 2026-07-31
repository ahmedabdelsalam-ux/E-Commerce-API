import {
  Component,
  inject,
  Input,
  ElementRef,
  AfterViewInit,
  NgZone,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../../../core/models/productsInter/product.interface';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../features/cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent implements AfterViewInit {
  @Input() cardProduct!: Product;
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly el = inject(ElementRef);
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return; // مش هيشتغل على السيرفر

    this.ngZone.runOutsideAngular(async () => {
      const gsap = (await import('gsap')).gsap;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(this.el.nativeElement, {
        scrollTrigger: {
          trigger: this.el.nativeElement,
          start: 'top 85%',
        },
        y: 60,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
      });
    });
  }

  addProductItemToCard(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          if (isPlatformBrowser(this.platformId)) {
            this.toastrService.success(res.message, 'Fresh Cart');
          }
        }
      },
      error: (err) => {
        console.log(err);
        if (isPlatformBrowser(this.platformId)) {
          this.toastrService.error(
            err?.error?.message || 'حدث خطأ أثناء إضافة المنتج',
            'Fresh Cart',
          );
        }
      },
    });
  }
}
