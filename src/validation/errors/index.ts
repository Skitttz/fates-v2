export class RequiredFieldError extends Error {
  constructor() {
    super('Campo obrigatório');
    this.name = 'RequiredFieldError';
  }
}

export class InvalidFieldError extends Error {
  constructor() {
    super('Valor inválido');
    this.name = 'InvalidFieldError';
  }
}

export class MinLengthError extends Error {
  constructor(length: number) {
    super(`Mínimo de ${length} caracteres`);
    this.name = 'MinLengthError';
  }
}
