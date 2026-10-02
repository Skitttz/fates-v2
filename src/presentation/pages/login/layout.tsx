import Image from 'next/image';
import { FormEvent } from 'react';
import LoginImg from '@/presentation/assets/mock-i-random-1.jpg';
import { Button, GlitchText, Input } from '@/presentation/components/ui';
import { DEMO_CREDENTIALS, LOGIN_PAGE } from './constants';
import { LoginLayoutProps } from './types';

export default function LoginLayout({
  values,
  errors,
  mainError,
  isLoading,
  onChange,
  onBlur,
  onSubmit,
}: LoginLayoutProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <div className="mx-auto grid max-w-[100em] gap-10 px-4 py-12 sm:px-8 lg:grid-cols-2 lg:gap-16">
      <div className="grain relative hidden min-h-[32rem] overflow-hidden border-2 border-zinc-800 lg:block">
        <Image
          src={LoginImg}
          alt="Adesivo Fates em um obstáculo da pista de skate"
          fill
          placeholder="blur"
          sizes="50vw"
          className="animate-ken-burns object-cover"
        />
      </div>

      <div className="flex animate-page-in flex-col justify-center gap-8">
        <div className="flex flex-col gap-3">
          <span className="font-marker text-lg text-street-lime">{LOGIN_PAGE.eyebrow}</span>
          <h1 className="font-display text-6xl uppercase leading-none sm:text-7xl">
            <GlitchText text={LOGIN_PAGE.title} />
          </h1>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex max-w-md flex-col gap-5">
          <Input
            label="E-mail"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            value={values.email}
            error={errors.email}
            onChange={(event) => onChange('email', event.target.value)}
            onBlur={() => onBlur('email')}
          />
          <Input
            label="Senha"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••"
            value={values.password}
            error={errors.password}
            onChange={(event) => onChange('password', event.target.value)}
            onBlur={() => onBlur('password')}
          />

          {mainError && (
            <p
              role="alert"
              className="animate-page-in border-2 border-street-orange bg-street-orange/10 px-4 py-3 text-sm text-street-orange"
            >
              {mainError}
            </p>
          )}

          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? LOGIN_PAGE.loading : LOGIN_PAGE.submit}
          </Button>
        </form>

        <aside className="max-w-md -rotate-1 border-2 border-dashed border-street-yellow/60 p-4 text-sm text-zinc-300">
          <p className="mb-1 font-marker text-street-yellow">{LOGIN_PAGE.demoTitle}</p>
          <p>
            E-mail: <code className="text-zinc-50">{DEMO_CREDENTIALS.email}</code>
          </p>
          <p>
            Senha: <code className="text-zinc-50">{DEMO_CREDENTIALS.password}</code>
          </p>
        </aside>
      </div>
    </div>
  );
}
