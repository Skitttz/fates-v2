import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChoicePhotos, WalkHint } from '.';

const options = [
  { id: 'caixote', label: 'Caixote', photo: 'caixote', outcome: 'Any outcome' },
  { id: 'poste', label: 'Poste', photo: 'poste', outcome: 'Any outcome' },
];

describe('ChoicePhotos', () => {
  it('keeps every photo loaded and shows only the chosen one', () => {
    const { container } = render(<ChoicePhotos options={options} chosen="poste" />);
    const photos = [...container.querySelectorAll('img')];

    expect(photos).toHaveLength(2);
    expect(photos.map((photo) => photo.className)).toEqual([
      'object-cover opacity-0',
      'object-cover opacity-100',
    ]);
  });

  it('hides every photo before a choice', () => {
    const { container } = render(<ChoicePhotos options={options} chosen={null} />);

    expect(container.querySelectorAll('img.opacity-100')).toHaveLength(0);
  });
});

describe('WalkHint', () => {
  it('tells where to go and which keys to use', () => {
    render(<WalkHint />);

    expect(screen.getByText('Leve o Paulo até o brilho.')).toBeInTheDocument();
    expect(screen.getByText('Use ← e → para andar e Espaço para pular.')).toBeInTheDocument();
  });
});
