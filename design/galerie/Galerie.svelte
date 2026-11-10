<script lang="ts">
  import Badge from '../kit/Badge.svelte';
  import Segmented from '../kit/Segmented.svelte';
  import type { Option } from '../kit/types.ts';
  import { LEGENDE } from './inventaire.ts';
  import Bascules from './sections/Bascules.svelte';
  import Boutons from './sections/Boutons.svelte';
  import Calques from './sections/Calques.svelte';
  import Cartes from './sections/Cartes.svelte';
  import Champs from './sections/Champs.svelte';
  import Listes from './sections/Listes.svelte';
  import Navigation from './sections/Navigation.svelte';
  import Tuiles from './sections/Tuiles.svelte';
  import Variables from './sections/Variables.svelte';

  /*
   * The gallery of the shared kit: every component in its states, sorted by family then by use, in the world chosen
   * at the top. A local page (`npm run galerie`, from design/): it shows the kit, it does not redraw it.
   */
  const MONDES: Option[] = [
    { value: 'neutre', label: 'Neutre' },
    { value: 'anima', label: 'Anima' },
    { value: 'acedia', label: 'Acedia' },
    { value: 'avaritia', label: 'Avaritia' },
    { value: 'luxuria', label: 'Luxuria' },
  ];
  const SOMMAIRE = [
    ['boutons', 'Boutons'],
    ['champs', 'Champs'],
    ['bascules', 'Bascules et pastilles'],
    ['calques', 'Ce qui flotte'],
    ['listes', 'Listes et réglages'],
    ['tuiles', 'Tuiles et écrans seuls'],
    ['navigation', 'Navigation'],
    ['cartes', 'Cartes'],
    ['variables', 'Variables de design'],
  ] as const;

  let { monde = $bindable('anima') }: { monde?: string } = $props();
</script>

<div class="galerie">
  <!-- The header carries the world too: without it the selector itself would have no accent. -->
  <header class="tete" data-monde={monde}>
    <div class="titre">
      <h1>Galerie du kit</h1>
      <p>
        Les composants communs de l’écosystème, tels qu’ils sont dans <code>design/kit/</code>, sur la base de
        page du core.
      </p>
    </div>
    <div class="monde">
      <span>Monde</span>
      <Segmented options={MONDES} value={monde} label="Monde" onchange={(v) => (monde = v)} />
    </div>
    <dl class="legende" aria-label="Légende">
      <div>
        <dt><Badge tone="ok">{LEGENDE.commun.mot}</Badge></dt>
        <dd>{LEGENDE.commun.sens}</dd>
      </div>
      <div>
        <dt><Badge tone="attention">{LEGENDE.variante.mot}</Badge></dt>
        <dd>{LEGENDE.variante.sens}</dd>
      </div>
      <div>
        <dt><Badge tone="info">{LEGENDE.propre.mot}</Badge></dt>
        <dd>{LEGENDE.propre.sens}</dd>
      </div>
    </dl>
    <nav aria-label="Familles">
      {#each SOMMAIRE as [id, mot] (id)}<a href="#{id}">{mot}</a>{/each}
    </nav>
  </header>

  <!-- Remounted on a world change: Dialog, ConfirmDialog, CommandPalette and Select read their world once. -->
  {#key monde}
    <div class="vitrines" data-monde={monde}>
      <Boutons />
      <Champs />
      <Bascules />
      <Calques />
      <Listes />
      <Tuiles />
      <Navigation />
      <Cartes />
      <Variables />
    </div>
  {/key}
</div>

<style>
  .galerie {
    min-height: 100dvh;
  }
  .tete,
  .vitrines {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 28px;
  }
  .tete {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 18px 28px;
    padding-top: 36px;
    padding-bottom: 24px;
  }
  h1 {
    margin: 0;
    font: 500 44px/1.05 var(--serif);
  }
  .titre p {
    margin: 8px 0 0;
    max-width: 62ch;
    font-size: 14px;
    color: var(--texte-2);
  }
  code {
    font:
      12.5px ui-monospace,
      Consolas,
      monospace;
  }
  .monde {
    display: grid;
    align-content: start;
    justify-items: end;
    gap: 6px;
    font-size: 12px;
    color: var(--texte-3);
  }
  .legende {
    grid-column: 1 / -1;
    display: flex;
    flex-wrap: wrap;
    gap: 10px 28px;
    margin: 0;
    padding: 14px 16px;
    border: 1px solid var(--bordure);
    border-radius: var(--r-2);
    background: var(--surface-1);
  }
  .legende div {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
  }
  dt,
  dd {
    margin: 0;
  }
  dd {
    color: var(--texte-2);
  }
  nav {
    grid-column: 1 / -1;
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
    font-size: 13.5px;
  }
  nav a {
    color: var(--texte-2);
    text-decoration: none;
    border-bottom: 1px solid transparent;
  }
  nav a:hover,
  nav a:focus-visible {
    color: var(--texte);
    border-bottom-color: var(--accent-bord);
  }
  .vitrines {
    display: grid;
    gap: 44px;
    padding-bottom: 80px;
  }
  @media (max-width: 767.98px) {
    .tete,
    .vitrines {
      padding-left: 16px;
      padding-right: 16px;
    }
    .tete {
      grid-template-columns: 1fr;
    }
    .monde {
      justify-items: start;
    }
    h1 {
      font-size: 34px;
    }
  }
</style>
