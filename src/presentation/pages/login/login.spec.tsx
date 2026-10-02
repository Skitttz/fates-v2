import { routerMock } from '@/presentation/test/mock-next-navigation';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { InvalidCredentialsError } from '@/domain/errors';
import { AuthenticationSpy, renderWithProviders, ValidationStub } from '@/presentation/test';
import { Login } from '.';

const makeSut = () => {
  const validation = new ValidationStub();
  const authentication = new AuthenticationSpy();
  const utils = renderWithProviders(
    <Login validation={validation} authentication={authentication} redirectTo="/cart" />,
  );
  return { ...utils, validation, authentication };
};

const fillForm = async (email = 'demo@fates.com', password = 'fates123') => {
  await userEvent.type(screen.getByLabelText('E-mail'), email);
  await userEvent.type(screen.getByLabelText('Senha'), password);
};

describe('Login page', () => {
  beforeEach(() => {
    routerMock.replace.mockClear();
  });

  it('shows validation errors and does not authenticate when form is invalid', async () => {
    const { validation, authentication } = makeSut();
    validation.errors = { email: 'Campo obrigatório', password: 'Campo obrigatório' };

    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(screen.getAllByText('Campo obrigatório')).toHaveLength(2);
    expect(authentication.callsCount).toBe(0);
  });

  it('validates a field on blur', async () => {
    const { validation } = makeSut();
    validation.errors = { email: 'Valor inválido' };

    await userEvent.type(screen.getByLabelText('E-mail'), 'invalid');
    await userEvent.tab();

    expect(screen.getByText('Valor inválido')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true');
  });

  it('authenticates, saves the account and redirects', async () => {
    const { authentication, account } = makeSut();
    await fillForm();

    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith('/cart'));
    expect(authentication.params).toEqual({ email: 'demo@fates.com', password: 'fates123' });
    expect(account.account).toEqual(authentication.account);
  });

  it('shows the error message when credentials are invalid', async () => {
    const { authentication } = makeSut();
    authentication.error = new InvalidCredentialsError();
    await fillForm();

    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('E-mail ou senha inválidos.')).toBeInTheDocument();
    expect(routerMock.replace).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeEnabled();
  });
});
