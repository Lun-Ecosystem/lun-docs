<script lang="ts">
  import type { Snippet } from 'svelte';
  import Badge from '../kit/Badge.svelte';
  import { ailleurs, LEGENDE, type Famille } from './inventaire.ts';

  /*
   * One family of the gallery: what the kit renders, then what the projects have of their own, named and not
   * rendered. A family without anything in the kit (the cards) has only that list.
   */
  type Props = {
    id: Famille | 'variables';
    titre: string;
    intro: string;
    children?: Snippet | undefined;
  };
  let { id, titre, intro, children }: Props = $props();

  const autres = $derived(id === 'variables' ? [] : ailleurs(id));
  const ton = { commun: 'ok', variante: 'attention', propre: 'info' } as const;
</script>

<section class="famille" {id} aria-labelledby="t-{id}">
  <header>
    <h2 id="t-{id}">{titre}</h2>
    <p>{intro}</p>
  </header>
  {@render children?.()}
  {#if autres.length > 0}
    <div class="ailleurs">
      <h3>Dans les projets</h3>
      <ul>
        {#each autres as e (e.nom + e.statut + e.projets[0])}
          <li>
            <Badge tone={ton[e.statut]}>{LEGENDE[e.statut].mot}</Badge>
            <span class="nom">{e.nom}</span>
            {#if e.absentDe}
              <span class="note">Dans le kit, mais pas encore dans {e.absentDe.join(', ')}.</span>
            {:else}
              <span class="ou">{e.projets.join(', ')}</span>
              <code>{e.fichier}</code>
              {#if e.note}<span class="note">{e.note}</span>{/if}
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</section>

<style>
  .famille {
    display: grid;
    gap: 28px;
    padding-top: 28px;
    border-top: 1px solid var(--bordure-forte);
    scroll-margin-top: 16px;
  }
  header {
    display: grid;
    gap: 6px;
  }
  h2 {
    margin: 0;
    font: 500 30px/1.1 var(--serif);
  }
  p {
    margin: 0;
    max-width: 70ch;
    font-size: 14px;
    color: var(--texte-2);
  }
  .ailleurs {
    display: grid;
    gap: 10px;
    padding: 16px 18px;
    border: 1px dashed var(--bordure-forte);
    border-radius: var(--r-3);
  }
  h3 {
    margin: 0;
    font: 500 12px/1.3 var(--sans);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--texte-3);
  }
  ul {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 12px;
    font-size: 13.5px;
  }
  .nom {
    font-weight: 500;
  }
  .ou,
  .note {
    color: var(--texte-2);
  }
  code {
    font:
      12px ui-monospace,
      Consolas,
      monospace;
    color: var(--texte-3);
    overflow-wrap: anywhere;
  }
</style>
