import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

export interface RequestOptions {
    params?: HttpParams | { [key: string]: string | string[] };
    headers?: HttpHeaders | { [header: string]: string | string[] };
    context?: HttpContext;
    responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}
