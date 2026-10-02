import { HttpClient, HttpRequest, HttpResponse, HttpStatusCode } from '../protocols/http';

export class HttpClientSpy<R = unknown> implements HttpClient<R> {
  url?: string;
  method?: string;
  body?: unknown;
  callsCount = 0;
  response: HttpResponse<R> = { statusCode: HttpStatusCode.ok };

  async request(data: HttpRequest): Promise<HttpResponse<R>> {
    this.url = data.url;
    this.method = data.method;
    this.body = data.body;
    this.callsCount += 1;
    return this.response;
  }
}
