import { Routes } from '@angular/router';
import { LoginComponent } from './core/Auth/login/login.component';
import { RegisterComponent } from './core/Auth/register/register.component';
import { authGuardsGuard } from './core/guards/auth-guards-guard';
import { AuthLayoutComponent } from './core/layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { HomeComponent } from './features/home/home.component';
import { ProductsComponent } from './features/products/products.component';

import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { DetailsComponent } from './features/details/details.component';
import { NotfoundComponent } from './features/notfound/notfound.component';

import { gestGuard } from './core/guards/gest-guard';
import { AboutComponent } from './features/about/about.component';
import { ContactUsComponent } from './features/contact-us/contact-us.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    title: 'Home',
  },

  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [gestGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
      },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Register',
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuardsGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
        title: 'Home',
      },
      {
        path: 'products',
        component: ProductsComponent,
        title: 'Products',
      },
      {
        path: 'about',
        component: AboutComponent,
        title: 'About',
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        title: 'Categories',
      },
      {
        path: 'contact-us',
        component: ContactUsComponent,
        title: 'Contact Us',
      },
      {
        path: 'cart',
        component: CartComponent,
        title: 'Cart',
      },
      {
        path: 'checkout/:id',
        component: CheckoutComponent,
        title: 'Checkout',
      },

      {
        path: 'details/:slug/:id',
        component: DetailsComponent,
        title: 'Details',
      },
    ],
  },

  {
    path: '**',
    component: NotfoundComponent,
    title: 'Error',
  },
];
