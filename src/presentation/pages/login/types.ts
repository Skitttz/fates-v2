import { Authentication } from '@/domain/usecases';
import { Validation } from '@/presentation/protocols';

export type LoginProps = {
  validation: Validation;
  authentication: Authentication;
  redirectTo: string;
};

export type LoginFormState = {
  email: string;
  password: string;
};

export type LoginFormErrors = Partial<Record<keyof LoginFormState, string | null>>;

export type LoginLayoutProps = {
  values: LoginFormState;
  errors: LoginFormErrors;
  mainError: string;
  isLoading: boolean;
  onChange: (field: keyof LoginFormState, value: string) => void;
  onBlur: (field: keyof LoginFormState) => void;
  onSubmit: () => void;
};
