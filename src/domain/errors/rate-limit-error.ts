export class RateLimitError extends Error {
  constructor() {
    super('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
    this.name = 'RateLimitError';
  }
}
