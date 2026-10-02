import { LoginFormState } from './types';

export const LOGIN_FIELDS: Array<keyof LoginFormState> = ['email', 'password'];

export const INITIAL_LOGIN_STATE: LoginFormState = { email: '', password: '' };

export const LOGIN_PAGE = {
  eyebrow: 'área da crew',
  title: 'Entrar',
  submit: 'Entrar',
  loading: 'Entrando...',
  demoTitle: 'Conta demo',
};

export const DEMO_CREDENTIALS = {
  email: 'demo@fates.com',
  password: 'fates123',
};
