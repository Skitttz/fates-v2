import { HttpClient, HttpRequest, HttpResponse, HttpStatusCode } from '@/data/protocols/http';
import { NextFetchConfig } from '../models';

export class FetchHttpClient<R = unknown> implements HttpClient<R> {
  constructor(private readonly config: NextFetchConfig = {}) {}

  async request({ url, method, body, headers }: HttpRequest): Promise<HttpResponse<R>> {
    const hasBody = body !== undefined;

    let response: Response;
    try {
      response = await fetch(url, {
        ...this.config,
        method: method.toUpperCase(),
        headers: hasBody ? { 'Content-Type': 'application/json', ...headers } : headers,
        body: hasBody ? JSON.stringify(body) : undefined,
      });
    } catch {
      return { statusCode: HttpStatusCode.serverError };
    }

    return {
      statusCode: response.status,
      body: await this.parseBody(response),
    };
  }

  private async parseBody(response: Response): Promise<R | undefined> {
    const text = await response.text().catch(() => '');
    if (!text) return undefined;

    try {
      return JSON.parse(text) as R;
    } catch {
      return undefined;
    }
  }
}
