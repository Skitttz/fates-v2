'use client';

import { useState } from 'react';
import { Login } from '@/presentation/pages/login';
import { makeRemoteAuthentication } from '../../usecases';
import { makeLoginValidation } from '../../validation';

export function LoginFactory({ redirectTo }: { redirectTo: string }) {
  const [validation] = useState(makeLoginValidation);
  const [authentication] = useState(makeRemoteAuthentication);

  return <Login validation={validation} authentication={authentication} redirectTo={redirectTo} />;
}
