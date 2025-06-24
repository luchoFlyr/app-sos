import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { RequestOptions } from '../models/RequestOptions.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  public baseUrl = environment.panicNowApiUrl;

  constructor(private http: HttpClient) {}

  get<T>(path: string, options: RequestOptions = {}): Observable<T> {
    return this.request<T>('GET', path, null, options);
  }

  post<T, U = T>(path: string, body: U, options: RequestOptions = {}): Observable<T> {
    return this.request<T>('POST', path, body, options);
  }

  put<T, U = T>(path: string, body: U, options: RequestOptions = {}): Observable<T> {
    return this.request<T>('PUT', path, body, options);
  }

  patch<T, U = T>(path: string, body: U, options: RequestOptions = {}): Observable<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  delete<T>(path: string, options: RequestOptions = {}): Observable<T> {
    return this.request<T>('DELETE', path, null, options);
  }

  private request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    body: any | null,
    options: RequestOptions
  ): Observable<T> {
    const url = `${this.baseUrl}/${path.replace(/^\/+/, '')}`;

    return this.http.request<T>(method, url, {
      body,
      params: options.params,
      headers: options.headers,
      context: options.context,
      responseType: options.responseType as any
    }).pipe(
      map(res => res as T),
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {
    console.error('API Error:', err);
    return throwError(() => err);
  }
}
