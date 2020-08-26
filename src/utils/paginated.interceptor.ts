import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { classToPlain } from "class-transformer";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

@Injectable()
export default class PaginatedSerializeInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => this.serialize(data)));
  }

  serialize(data: PaginatedResponse<any>): PaginatedResponse<any> {
    data.items = data.items.map(item => classToPlain(item));
    return data;
  }
}
