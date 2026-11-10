import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CARTES } from './donnees.ts';
import Pistes from './Pistes.svelte';

describe('the mock-ups of the cards and the permission', () => {
  it('draws the three directions on the same four cards, and the permission in each', () => {
    const { container } = render(Pistes);
    for (const nom of ['La feuille', 'La rangée', 'Le mot'])
      expect(screen.getByRole('heading', { level: 2, name: new RegExp(nom) })).toBeInTheDocument();
    // The neutral title in A and B, the agent's sentence in C: each card three times.
    for (const c of CARTES) {
      expect(screen.getAllByText(c.titre)).toHaveLength(2);
      expect(screen.getAllByText(c.parole)).toHaveLength(1);
    }
    expect(container.querySelectorAll('[aria-label^="Permission"]')).toHaveLength(3);
  });

  it('follows the world chosen at the top', async () => {
    const { container } = render(Pistes);
    await userEvent.click(screen.getByRole('radio', { name: 'Luxuria' }));
    expect(container.querySelector('.pistes')).toHaveAttribute('data-monde', 'luxuria');
  });
});
