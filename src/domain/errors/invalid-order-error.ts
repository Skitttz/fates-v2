export class InvalidOrderError extends Error {
  constructor(message = 'Não foi possível finalizar o pedido.') {
    super(message);
    this.name = 'InvalidOrderError';
  }
}
