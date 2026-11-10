import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { dismissAll } from '../kit/toasts.svelte.ts';
import Galerie from './Galerie.svelte';
import { INVENTAIRE } from './inventaire.ts';

const KIT = join(import.meta.dirname, '..', 'kit');
const SECTIONS = join(import.meta.dirname, 'sections');
const composants = readdirSync(KIT)
  .filter((f) => f.endsWith('.svelte'))
  .map((f) => f.replace('.svelte', ''));
const balisage = readdirSync(SECTIONS)
  .map((f) => readFileSync(join(SECTIONS, f), 'utf8'))
  // The markup only: an import that renders nothing does not show a component.
  .map((source) => source.replace(/<script[\s\S]*?<\/script>/, ''))
  .join('\n');

afterEach(dismissAll);

describe('the gallery shows the whole kit', () => {
  it.each(composants)('%s is rendered by a section', (nom) => {
    expect(balisage).toMatch(new RegExp(`<${nom}[\\s/>]`));
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
});

describe('the gallery page', () => {
  const FAMILLES = [
    'Boutons',
    'Champs',
    'Bascules et pastilles',
    'Ce qui flotte',
    'Listes et réglages',
    'Cartes d’information',
    'Navigation',
    'Variables de design',
  ];

  it('renders every family, and its legend', () => {
    render(Galerie);
    for (const titre of FAMILLES)
      expect(screen.getByRole('heading', { level: 2, name: titre })).toBeInTheDocument();
    expect(screen.getByText('Dans le kit : le même dans tous les projets.')).toBeInTheDocument();
  });

  it('the world selector changes the world of the showcases and of the header', async () => {
    const { container } = render(Galerie);
    expect(container.querySelector('.vitrines')).toHaveAttribute('data-monde', 'anima');
    await userEvent.click(screen.getByRole('radio', { name: 'Luxuria' }));
    expect(container.querySelector('.vitrines')).toHaveAttribute('data-monde', 'luxuria');
    expect(container.querySelector('.tete')).toHaveAttribute('data-monde', 'luxuria');
    for (const titre of FAMILLES)
      expect(screen.getByRole('heading', { level: 2, name: titre })).toBeInTheDocument();
  });

  it('names under a family what lives in the projects, outside the kit', () => {
    render(Galerie);
    expect(screen.getByText('Fab')).toBeInTheDocument();
    expect(screen.getByText('views/src/lib/ui/Fab.svelte')).toBeInTheDocument();
  });
});
