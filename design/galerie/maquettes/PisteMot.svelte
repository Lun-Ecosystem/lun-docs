<script lang="ts">
  import Button from '../../kit/Button.svelte';
  import { Check, ICON_STROKE, Undo } from '../../kit/Icon.ts';
  import { CARTES, PERMISSION, type CarteMaquette } from './donnees.ts';

  /*
   * Direction C, « Le mot »: the card is something the agent says. Its mark, one sentence in its voice, what it is
   * about set as a quote, the reason after it, and the answers as words. Made for the conversation and for the body;
   * a permission is the same shape, shorter. Reads slower in a long queue.
   */
  const tranchee = CARTES[0]!;
</script>

{#snippet mot(c: CarteMaquette)}
  <article class={['mot', c.sorte]} aria-label="{c.type} : {c.titre}">
    <span class="sceau" aria-hidden="true">{c.poste.replace("Lun'", '').charAt(0)}</span>
    <div class="bulle">
      <p class="qui"><span>{c.poste}</span><span>{c.heure}</span><span class="type">{c.type}</span></p>
      <p class="parole">{c.parole}</p>
      {#if c.apercu}
        <blockquote>{c.apercu}</blockquote>
      {:else if c.lignes.length}
        <blockquote>
          {#each c.lignes as [k, v] (k)}<span><i>{k}</i>{v}</span>{/each}
        </blockquote>
      {/if}
      <p class="raison">
        {c.raison}{#if c.envoie}{' '}{c.envoie}{/if}
      </p>
      <div class="reponses">
        {#if c.options}
          {#each c.options as o (o)}<Button variant="doux" size="petit">{o}</Button>{/each}
          <Button variant="fantome" size="petit">Plus tard</Button>
        {:else}
          <Button variant={c.sorte === 'suppression' ? 'danger' : 'doux'} size="petit">Oui</Button>
          <Button variant="fantome" size="petit">Autrement</Button>
          <Button variant="fantome" size="petit">Non</Button>
        {/if}
      </div>
    </div>
  </article>
{/snippet}

<div class="piste">
  <div class="fil">
    {#each CARTES as c (c.id)}{@render mot(c)}{/each}
  </div>
  <div class="cote">
    <div>
      <p class="etiquette">Tranchée</p>
      <div class="mot faite">
        <span class="sceau" aria-hidden="true">A</span>
        <div class="bulle">
          <p class="parole petite">
            <Check size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />{tranchee.fait}.
            <Button variant="fantome" size="petit" icon={Undo}>Annuler</Button>
          </p>
        </div>
      </div>
    </div>
    <div>
      <p class="etiquette">Compacte, dans une liste</p>
      <span class="souffle">Factures ?<Button variant="fantome" size="petit">Oui</Button></span>
    </div>
    <div>
      <p class="etiquette">La permission</p>
      <article class="mot permission" aria-label="Permission : {PERMISSION.quoi}">
        <span class="sceau" aria-hidden="true">L</span>
        <div class="bulle">
          <p class="parole">{PERMISSION.parole}</p>
          <p class="raison">{PERMISSION.pourquoi}</p>
          <div class="reponses">
            <Button variant="doux" size="petit">{PERMISSION.reponses[0]}</Button>
            <Button variant="fantome" size="petit">Toujours</Button>
            <Button variant="fantome" size="petit">Non</Button>
          </div>
        </div>
      </article>
    </div>
  </div>
</div>

<style>
  .piste {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    gap: 28px;
    align-items: start;
  }
  .fil {
    display: grid;
    gap: 16px;
  }
  .cote {
    display: grid;
    gap: 22px;
  }
  .etiquette {
    margin: 0 0 8px;
    font: 500 11.5px/1.3 var(--sans);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--texte-3);
  }
  .mot {
    --ton: var(--accent-bord);
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .mot.suppression {
    --ton: var(--danger-bord);
  }
  .sceau {
    display: grid;
    flex: none;
    place-items: center;
    width: 30px;
    height: 30px;
    margin-top: 2px;
    border: 1px solid var(--accent-bord);
    border-radius: 50%;
    background: var(--accent-doux);
    font: 500 15px/1 var(--serif);
    color: var(--accent-texte);
  }
  .bulle {
    display: grid;
    flex: 1;
    gap: 8px;
    min-width: 0;
    padding: 12px 16px 12px;
    border: 1px solid var(--bordure);
    border-left: 2px solid var(--ton);
    border-radius: 4px var(--r-3) var(--r-3) var(--r-3);
    background: var(--surface-1);
  }
  .qui {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 10px;
    margin: 0;
    font-size: 12px;
    color: var(--texte-3);
  }
  .type {
    margin-left: auto;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .parole {
    margin: 0;
    font: 500 20px/1.3 var(--serif);
  }
  .parole.petite {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font: 400 13.5px/1.4 var(--sans);
    color: var(--texte-2);
  }
  .parole.petite :global(svg:first-child) {
    color: var(--ok);
  }
  blockquote {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 18px;
    margin: 0;
    padding: 2px 0 2px 12px;
    border-left: 1px solid var(--bordure-forte);
    font-size: 13.5px;
    color: var(--texte-2);
  }
  blockquote i {
    margin-right: 6px;
    font-style: normal;
    color: var(--texte-3);
  }
  .raison {
    margin: 0;
    font-size: 12.5px;
    color: var(--texte-3);
  }
  .reponses {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .souffle {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font: 500 16px/1 var(--serif);
    color: var(--texte-2);
  }
  @media (max-width: 900px) {
    .piste {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
