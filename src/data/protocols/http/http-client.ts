export type HttpMethod = 'post' | 'get' | 'put' | 'delete';

export type HttpRequest = {
  url: string;
  method: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
};

export enum HttpStatusCode {
  ok = 200,
  created = 201,
  noContent = 204,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  tooManyRequests = 429,
  serverError = 500,
}

export type HttpResponse<T = unknown> = {
  statusCode: HttpStatusCode;
  body?: T;
};

export interface HttpClient<R = unknown> {
  request: (data: HttpRequest) => Promise<HttpResponse<R>>;
}
