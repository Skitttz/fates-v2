export class NotFoundError extends Error {
  constructor() {
    super('Recurso não encontrado.');
    this.name = 'NotFoundError';
  }
}
