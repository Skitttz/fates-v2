import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SearchForm } from './product';
import { Input } from './ui';

const MOBILE_SAFE_FONT = /(^|\s)text-base(\s|$)/;

describe('text inputs on mobile', () => {
  it('uses 16px in the search field so iOS Safari does not zoom on focus', () => {
    render(<SearchForm />);

    expect(screen.getByRole('searchbox').className).toMatch(MOBILE_SAFE_FONT);
  });

  it('uses 16px in the form inputs so iOS Safari does not zoom on focus', () => {
    render(<Input label="E-mail" />);

    expect(screen.getByLabelText('E-mail').className).toMatch(MOBILE_SAFE_FONT);
  });
});
