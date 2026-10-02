import type { Metadata } from 'next';
import { LoginFactory } from '@/main/pages/login/login-factory';
import { safeRedirect } from '@/presentation/helpers';

export const metadata: Metadata = {
  title: 'Entrar',
};

type LoginRouterProps = {
  searchParams: Promise<{ redirect?: string | string[] }>;
};

export default async function LoginRouter({ searchParams }: LoginRouterProps) {
  const query = await searchParams;
  const redirect = Array.isArray(query.redirect) ? query.redirect[0] : query.redirect;

  return <LoginFactory redirectTo={safeRedirect(redirect)} />;
}
