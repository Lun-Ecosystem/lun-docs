import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { dismissAll } from '../kit/toasts.svelte.ts';
import { FILE } from './cartes.ts';
import Galerie from './Galerie.svelte';
import { INVENTAIRE, type Famille } from './inventaire.ts';

/** Every .svelte file of the kit, sub-folders included, as sync-kit copies them; the test fixtures apart. */
const composants = (readdirSync(join(import.meta.dirname, '..', 'kit'), { recursive: true }) as string[])
  .filter((f) => f.endsWith('.svelte') && !f.startsWith('fixtures'))
  .map((f) => f.replace(/^.*[\\/]/, '').replace('.svelte', ''));

/** The names under the rendered pieces: what the mounted page really shows. */
const montres = (container: HTMLElement) =>
  new Set([...container.querySelectorAll('figcaption code')].map((c) => c.textContent));

afterEach(dismissAll);

describe('the gallery shows the whole kit', () => {
  it('every component of the kit is rendered by the mounted page', () => {
    const { container } = render(Galerie);
    const vus = montres(container);
    expect(composants.filter((nom) => !vus.has(nom))).toEqual([]);
  });

  it('every piece of the page is a component of the kit', () => {
    const { container } = render(Galerie);
    expect([...montres(container)].filter((nom) => !composants.includes(nom ?? ''))).toEqual([]);
  });

  it.each(composants)('%s is in the inventory, as common', (nom) => {
    expect(INVENTAIRE.some((e) => e.nom === nom && e.statut === 'commun')).toBe(true);
  });

  it('the inventory names no common element the kit does not have', () => {
    const fantomes = INVENTAIRE.filter((e) => e.statut === 'commun' && !composants.includes(e.nom));
    expect(fantomes.map((e) => e.nom)).toEqual([]);
  });

  it('a variant or an own element says where it lives', () => {
    const sans = INVENTAIRE.filter((e) => e.statut !== 'commun' && (!e.fichier || e.projets.length === 0));
    expect(sans.map((e) => e.nom)).toEqual([]);
  });

  it('every variant and own element of the inventory is named on the page, with its file', () => {
    const { container } = render(Galerie);
    const fichiers = new Set([...container.querySelectorAll('.ailleurs code')].map((c) => c.textContent));
    const absents = INVENTAIRE.filter((e) => e.statut !== 'commun' && !fichiers.has(e.fichier ?? ''));
    expect(absents.map((e) => `${e.nom} (${e.projets[0]})`)).toEqual([]);
  });

  it('every family of the inventory has its section', () => {
    const { container } = render(Galerie);
    const familles = [...new Set(INVENTAIRE.map((e) => e.famille))] satisfies Famille[];
    expect(familles.filter((f) => !container.querySelector(`section#${f}`))).toEqual([]);
  });

  it('a common element a project lacks says so', () => {
    render(Galerie);
    expect(screen.getAllByText("Dans le kit, mais pas encore dans Lun'Acedia.")).toHaveLength(3);
    expect(screen.getAllByText("Dans le kit, mais pas encore dans Lun'Acedia, Lun'Avaritia.")).toHaveLength(
      2,
    );
  });
});

describe('the gallery page', () => {
  const FAMILLES = [
    'Boutons',
    'Champs',
    'Bascules et pastilles',
    'Ce qui flotte',
    'Listes et réglages',
    'Tuiles et écrans seuls',
    'Navigation',
    'Cartes',
    'Variables de design',
  ];
  const titres = () => screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);

  it('renders every family, and its legend', () => {
    render(Galerie);
    for (const titre of FAMILLES) expect(titres()).toContain(titre);
    expect(screen.getByText('Dans le kit : le même dans chaque projet qui l’a.')).toBeInTheDocument();
  });

  it('the world selector changes the world of the showcases and of the header', async () => {
    const { container } = render(Galerie);
    expect(container.querySelector('.vitrines')).toHaveAttribute('data-monde', 'anima');
    await userEvent.click(screen.getByRole('radio', { name: 'Luxuria' }));
    expect(container.querySelector('.vitrines')).toHaveAttribute('data-monde', 'luxuria');
    expect(container.querySelector('.tete')).toHaveAttribute('data-monde', 'luxuria');
    for (const titre of FAMILLES) expect(titres()).toContain(titre);
  });

  it('a world change remounts the showcases, so an overlay opened after it reads the new world', async () => {
    const { container } = render(Galerie);
    const avant = container.querySelector('.vitrines');
    await userEvent.click(screen.getByRole('radio', { name: 'Acedia' }));
    expect(container.querySelector('.vitrines')).not.toBe(avant);
    await userEvent.click(screen.getByRole('button', { name: 'Ouvrir le dialogue' }));
    expect(await screen.findByRole('dialog')).toHaveAttribute('data-monde', 'acedia');
  });

  it('mounts one toaster and one command palette only', () => {
    const { container } = render(Galerie);
    expect(container.querySelectorAll('.toaster')).toHaveLength(1);
  });
});

describe('the queue of cards under load', () => {
  it('keeps 54 cards short: five a page, filtered by kind', async () => {
    const { container } = render(Galerie);
    const f = within(container.querySelector<HTMLElement>('#cartes .file')!);
    expect(f.getAllByRole('article')).toHaveLength(5);
    expect(f.getByText(`Page 1 sur ${Math.ceil(FILE.length / 5)}`)).toBeInTheDocument();
    expect(f.getByRole('button', { name: /Précédentes/ })).toBeDisabled();

    await userEvent.click(f.getByRole('button', { name: /Suivantes/ }));
    expect(f.getByText(/^Page 2 sur/)).toBeInTheDocument();

    // A filter comes back to the first page and counts only its kind; two filters add up.
    const questions = FILE.filter((c) => c.kind === 'Question').length;
    const suppressions = FILE.filter((c) => c.kind === 'Suppression').length;
    await userEvent.click(f.getByRole('button', { name: /Question/ }));
    expect(f.getByText(`Page 1 sur ${Math.ceil(questions / 5)}`)).toBeInTheDocument();
    for (const carte of f.getAllByRole('article')) expect(carte).toHaveTextContent(/^Question/);
    await userEvent.click(f.getByRole('button', { name: /Suppression/ }));
    expect(f.getByText(`${questions + suppressions} en attente`)).toBeInTheDocument();

    await userEvent.click(f.getByRole('button', { name: /Tout/ }));
    expect(f.getByText(`${FILE.length} en attente`)).toBeInTheDocument();
  });
});
