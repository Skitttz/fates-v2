export class UnexpectedError extends Error {
  constructor() {
    super('Algo deu errado. Tente novamente em instantes.');
    this.name = 'UnexpectedError';
  }
}
