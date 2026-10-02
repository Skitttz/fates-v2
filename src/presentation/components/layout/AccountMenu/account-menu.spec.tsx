import '@/presentation/test/mock-next-navigation';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockAccountModel } from '@/domain/test';
import { InMemoryAccount, renderWithProviders } from '@/presentation/test';
import { AccountMenu } from '.';

const makeSut = () => {
  const account = new InMemoryAccount(mockAccountModel({ name: 'Demo' }));
  renderWithProviders(<AccountMenu />, { account });
  return { account };
};

describe('AccountMenu', () => {
  it('shows a link to sign in when there is no account', async () => {
    renderWithProviders(<AccountMenu />);

    expect(await screen.findByRole('link', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('asks for confirmation and keeps the account when cancelled', async () => {
    const { account } = makeSut();

    await userEvent.click(await screen.findByRole('button', { name: 'Sair da conta' }));
    const dialog = screen.getByRole('dialog', { name: 'Sair da conta?' });
    expect(dialog).toHaveAttribute('open');

    await userEvent.click(screen.getByRole('button', { name: 'Continuar conectado' }));

    expect(dialog).not.toHaveAttribute('open');
    expect(account.account).not.toBeNull();
    expect(screen.getByText('Demo')).toBeInTheDocument();
  });

  it('signs out after confirming', async () => {
    const { account } = makeSut();

    await userEvent.click(await screen.findByRole('button', { name: 'Sair da conta' }));
    await userEvent.click(screen.getByRole('button', { name: 'Sair' }));

    await waitFor(() => expect(account.account).toBeNull());
    expect(await screen.findByRole('link', { name: 'Entrar' })).toBeInTheDocument();
  });
});
