import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService);
  const platformId = inject(PLATFORM_ID);

  return next(req).pipe(
    catchError((err) => {
      if (isPlatformBrowser(platformId)) {
        const message = err?.error?.message || 'حدث خطأ غير متوقع';
        toastrService.error(message);
      } else {
        console.error('SSR HTTP Error:', err?.message || err);
      }

      return throwError(() => err);
    }),
  );
};
