<script lang="ts">
  import type { Snippet } from 'svelte';

  /*
   * One rendered piece and its caption: the component's name and the state shown. The legend (common, variant, own)
   * is said once by the group, not under every piece.
   */
  type Props = { nom: string; etat?: string | undefined; large?: boolean | undefined; children: Snippet };
  let { nom, etat, large = false, children }: Props = $props();
</script>

<figure class={{ large }}>
  <div class="rendu">{@render children()}</div>
  <figcaption>
    <code>{nom}</code>
    {#if etat}<span>{etat}</span>{/if}
  </figcaption>
</figure>

<style>
  figure {
    display: grid;
    align-content: space-between;
    gap: 10px;
    margin: 0;
    min-width: 0;
  }
  figure.large {
    grid-column: 1 / -1;
  }
  .rendu {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    min-width: 0;
    min-height: 34px;
  }
  .large .rendu {
    display: block;
  }
  figcaption {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 8px;
    font-size: 12px;
    color: var(--texte-3);
  }
  code {
    font:
      12px ui-monospace,
      Consolas,
      monospace;
    color: var(--texte-2);
  }
</style>
