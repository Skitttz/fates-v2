import { HttpClient, HttpRequest, HttpResponse, HttpStatusCode } from '../protocols/http';

export class HttpClientSpy<R = unknown> implements HttpClient<R> {
  url?: string;
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  callsCount = 0;
  response: HttpResponse<R> = { statusCode: HttpStatusCode.ok };

  async request(data: HttpRequest): Promise<HttpResponse<R>> {
    this.url = data.url;
    this.method = data.method;
    this.body = data.body;
    this.headers = data.headers;
    this.callsCount += 1;
    return this.response;
  }
}
