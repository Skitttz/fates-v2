'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAccount } from '@/presentation/contexts/account';
import { getErrorMessage } from '@/presentation/utils/getErrorMessage';
import { INITIAL_LOGIN_STATE, LOGIN_FIELDS } from './constants';
import LoginLayout from './layout';
import { LoginFormErrors, LoginFormState, LoginProps } from './types';

export function Login({ validation, authentication, redirectTo }: LoginProps) {
  const router = useRouter();
  const { signIn } = useAccount();
  const [values, setValues] = useState<LoginFormState>(INITIAL_LOGIN_STATE);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [mainError, setMainError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (field: keyof LoginFormState, input: LoginFormState) =>
    validation.validate(field, input);

  function handleChange(field: keyof LoginFormState, value: string) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    setMainError('');
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: validateField(field, nextValues) }));
    }
  }

  function handleBlur(field: keyof LoginFormState) {
    setErrors((current) => ({ ...current, [field]: validateField(field, values) }));
  }

  async function handleSubmit() {
    if (isLoading) return;

    const nextErrors = Object.fromEntries(
      LOGIN_FIELDS.map((field) => [field, validateField(field, values)]),
    ) as LoginFormErrors;
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setIsLoading(true);
    try {
      const account = await authentication.auth(values);
      await signIn(account);
      router.replace(redirectTo);
    } catch (error) {
      setMainError(getErrorMessage(error));
      setIsLoading(false);
    }
  }

  return (
    <LoginLayout
      values={values}
      errors={errors}
      mainError={mainError}
      isLoading={isLoading}
      onChange={handleChange}
      onBlur={handleBlur}
      onSubmit={handleSubmit}
    />
  );
}
