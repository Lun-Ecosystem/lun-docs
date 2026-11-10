<script lang="ts">
  import type { Snippet } from 'svelte';
  import Badge from '../kit/Badge.svelte';
  import { LEGENDE } from './inventaire.ts';

  /*
   * One use inside a family (« the main action »), with its pieces on a grid: states line up in columns, and a
   * variant that has `colonnes` states takes its own row. Everything rendered here comes from the kit, so the group
   * carries the legend « Commun » once; what is a variant or a project's own is named at the foot of the family.
   */
  type Props = {
    titre: string;
    sens?: string | undefined;
    /** Stacks wide pieces, one per row. */
    colonne?: boolean | undefined;
    /** Fixed number of columns, when each variant shows the same states. Three or fewer: wide pieces. */
    colonnes?: number | undefined;
    /** No legend: what is shown is not a component (the design variables). */
    sansLegende?: boolean | undefined;
    children: Snippet;
  };
  let { titre, sens, colonne = false, colonnes, sansLegende = false, children }: Props = $props();
  // On a phone a wide piece (a field, a code input) takes the whole row: two columns would push the page wider.
  const larges = $derived(colonnes !== undefined && colonnes <= 3);
</script>

<div class="groupe">
  <div class="tete">
    <h3>{titre}</h3>
    {#if sens}<p>{sens}</p>{/if}
    {#if !sansLegende}<span class="statut"><Badge tone="ok">{LEGENDE.commun.mot}</Badge></span>{/if}
  </div>
  <div class={['pieces', { colonne, fixe: colonnes !== undefined, larges }]} style:--colonnes={colonnes}>
    {@render children()}
  </div>
</div>

<style>
  .groupe {
    display: grid;
    gap: 12px;
  }
  .tete {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 14px;
  }
  h3 {
    margin: 0;
    font: 500 15px/1.3 var(--sans);
  }
  p {
    flex: 1;
    min-width: 200px;
    margin: 0;
    font-size: 13px;
    color: var(--texte-3);
  }
  .statut {
    margin-left: auto;
  }
  .pieces {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    align-items: stretch;
    gap: 22px 20px;
    padding: 20px;
    border: 1px solid var(--bordure);
    border-radius: var(--r-3);
    background: var(--surface-1);
  }
  .pieces.fixe {
    grid-template-columns: repeat(var(--colonnes), minmax(0, 1fr));
  }
  .pieces.colonne {
    grid-template-columns: minmax(0, 1fr);
  }
  @media (max-width: 767.98px) {
    .pieces,
    .pieces.fixe {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      padding: 14px;
    }
    .pieces.colonne,
    .pieces.larges {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
