import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { storedKey } from '../../constants/stored_Key';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem(storedKey.userToken);

    if (
      (token && req.url.includes('cart')) ||
      req.url.includes('checkout') ||
      req.url.includes('orders')
    ) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

  return next(req);
};
