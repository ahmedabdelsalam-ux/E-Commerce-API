import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CartService } from '../cart/services/cart.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);

  private readonly router = inject(Router);

  cartId: string | null = null;

  checkOutForm!: FormGroup;

  ngOnInit(): void {
    this.checkOutFormInit();
    this.getCartId();
  }

  getCartId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (urlparms) => {
        this.cartId = urlparms.get('id');
      },
    });
  }

  checkOutFormInit(): void {
    this.checkOutForm = this.fb.group({
      shippingAddress: this.fb.group({
        details: [null, [Validators.required]],
        phone: [null, [Validators.pattern(/^(?:\+20|0)?1[0125][0-9]{8}$/), Validators.required]],
        city: [null, [Validators.required]],
      }),
    });
  }

  onSubmitCheckOutForm(): void {
    if (this.checkOutForm.valid && this.cartId) {
      this.cartService.checkOutSession(this.cartId, this.checkOutForm.value).subscribe({
        next: (res) => {
          console.log(res);

          if (res.status === 'success') {
            alert(res.message);

            this.checkOutForm.reset();

            this.router.navigate(['/home']);
          }
        },

        error: (err) => {
          console.log(err);
          alert(err.error.message);
        },
      });
    } else {
      this.checkOutForm.markAllAsTouched();
    }
  }
}
