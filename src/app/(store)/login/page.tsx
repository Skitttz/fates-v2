import type { Metadata } from 'next';
import { LoginFactory } from '@/main/pages/login/login-factory';
import { safeRedirect } from '@/presentation/helpers';

export const metadata: Metadata = {
  title: 'Entrar',
};

type LoginRouterProps = {
  searchParams: { redirect?: string | string[] };
};

export default function LoginRouter({ searchParams }: LoginRouterProps) {
  const redirect = Array.isArray(searchParams.redirect)
    ? searchParams.redirect[0]
    : searchParams.redirect;

  return <LoginFactory redirectTo={safeRedirect(redirect)} />;
}
