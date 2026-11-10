<script lang="ts">
  import Button from '../../kit/Button.svelte';
  import Chip from '../../kit/Chip.svelte';
  import { ChevronLeft, ChevronRight } from '../../kit/Icon.ts';
  import Feuille from './Feuille.svelte';
  import type { CarteMaquette } from './donnees.ts';

  /*
   * The queue under load: filters by type of card, and pages, so that fifty cards never unroll. Several types can
   * be kept at once; none kept shows everything.
   */
  let { cartes, parPage = 5 }: { cartes: CarteMaquette[]; parPage?: number } = $props();

  let gardes = $state<string[]>([]);
  let page = $state(1);

  const types = $derived(
    [...new Set(cartes.map((c) => c.type))].map((t) => ({
      nom: t,
      nombre: cartes.filter((c) => c.type === t).length,
    })),
  );
  const visibles = $derived(gardes.length ? cartes.filter((c) => gardes.includes(c.type)) : cartes);
  const pages = $derived(Math.max(1, Math.ceil(visibles.length / parPage)));
  const tranche = $derived(visibles.slice((page - 1) * parPage, page * parPage));

  function basculer(type: string) {
    gardes = gardes.includes(type) ? gardes.filter((t) => t !== type) : [...gardes, type];
    page = 1;
  }
</script>

<div class="file">
  <div class="filtres" role="group" aria-label="Filtrer par type">
    <Chip
      on={!gardes.length}
      count={cartes.length}
      onclick={() => {
        gardes = [];
        page = 1;
      }}>Tout</Chip
    >
    {#each types as t (t.nom)}
      <Chip on={gardes.includes(t.nom)} count={t.nombre} onclick={() => basculer(t.nom)}>{t.nom}</Chip>
    {/each}
  </div>

  <div class="cartes">
    {#each tranche as c (c.id)}<Feuille carte={c} />{/each}
  </div>

  <nav class="pages" aria-label="Pages de la file">
    <Button
      variant="fantome"
      size="petit"
      icon={ChevronLeft}
      disabled={page === 1}
      onclick={() => (page -= 1)}>Précédentes</Button
    >
    <p aria-live="polite">
      Page {page} sur {pages}<span>{visibles.length} en attente</span>
    </p>
    <Button
      variant="fantome"
      size="petit"
      icon={ChevronRight}
      disabled={page === pages}
      onclick={() => (page += 1)}>Suivantes</Button
    >
  </nav>
</div>

<style>
  .file,
  .cartes {
    display: grid;
    gap: 14px;
  }
  .filtres {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .pages {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 10px;
    border-top: 1px solid var(--bordure);
  }
  .pages p {
    display: grid;
    justify-items: center;
    margin: 0;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
  }
  .pages span {
    font-size: 12px;
    color: var(--texte-3);
  }
</style>
