import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FILE } from './donnees.ts';
import Maquettes from './Maquettes.svelte';

const file = (container: HTMLElement) => within(container.querySelector<HTMLElement>('#file')!);

describe('the mock-ups of the cards and the permission', () => {
  it('draws the sheet in its parts: sorts, states, queue, narrow forms, permission', () => {
    const { container } = render(Maquettes);
    for (const nom of ['Les quatre sortes', 'Les états', 'La file', 'Les formes réduites', 'La permission'])
      expect(screen.getByRole('heading', { level: 2, name: new RegExp(nom) })).toBeInTheDocument();
    // Waiting and busy are sheets; the four answers fold into a line.
    expect(container.querySelectorAll('[aria-label^="Permission"]')).toHaveLength(2);
    expect(container.querySelectorAll('#permission .f-ligne')).toHaveLength(4);
    expect(container.querySelector('#etats [role="alert"]')).toHaveTextContent('Rien n’a été modifié');
  });

  it('keeps a queue of 54 cards short: five a page, filtered by type', async () => {
    const { container } = render(Maquettes);
    const f = file(container);
    expect(f.getAllByRole('article')).toHaveLength(5);
    expect(f.getByText(`Page 1 sur ${Math.ceil(FILE.length / 5)}`)).toBeInTheDocument();
    expect(f.getByRole('button', { name: /Précédentes/ })).toBeDisabled();

    await userEvent.click(f.getByRole('button', { name: /Suivantes/ }));
    expect(f.getByText(/^Page 2 sur/)).toBeInTheDocument();

    // A filter comes back to the first page and counts only its type; two filters add up.
    const questions = FILE.filter((c) => c.type === 'Question').length;
    const suppressions = FILE.filter((c) => c.type === 'Suppression').length;
    await userEvent.click(f.getByRole('button', { name: /Question/ }));
    expect(f.getByText(`Page 1 sur ${Math.ceil(questions / 5)}`)).toBeInTheDocument();
    for (const carte of f.getAllByRole('article')) expect(carte).toHaveAccessibleName(/^Question/);
    await userEvent.click(f.getByRole('button', { name: /Suppression/ }));
    expect(f.getByText(`${questions + suppressions} en attente`)).toBeInTheDocument();

    await userEvent.click(f.getByRole('button', { name: /Tout/ }));
    expect(f.getByText(`${FILE.length} en attente`)).toBeInTheDocument();
  });

  it('follows the world chosen at the top', async () => {
    const { container } = render(Maquettes);
    await userEvent.click(screen.getByRole('radio', { name: 'Luxuria' }));
    expect(container.querySelector('.parties')).toHaveAttribute('data-monde', 'luxuria');
  });
});
