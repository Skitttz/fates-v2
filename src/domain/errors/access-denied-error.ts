export class AccessDeniedError extends Error {
  constructor() {
    super('Acesso negado. Faça login para continuar.');
    this.name = 'AccessDeniedError';
  }
}
