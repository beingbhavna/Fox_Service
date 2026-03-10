// loader.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private service: ApiService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    this.service.show();

    return next.handle(req).pipe(
      finalize(() => {
        this.service.hide();
      })
    );

  }

}