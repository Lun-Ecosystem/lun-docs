<script lang="ts">
  import Button from '../../kit/Button.svelte';
  import { Check, ChevronDown, ChevronRight, ICON_STROKE, Pencil, Shield, Undo } from '../../kit/Icon.ts';
  import IconButton from '../../kit/IconButton.svelte';
  import Kbd from '../../kit/Kbd.svelte';
  import { CARTES, PERMISSION, type CarteMaquette } from './donnees.ts';

  /*
   * Direction B, « La rangée »: the queue is a list, one line per card, with the main gesture on the line itself.
   * A card unfolds in place when its content is needed. Made to decide fast and many; says less at rest.
   */
  let ouverte = $state('rangement');
  const tranchee = CARTES[0]!;
</script>

{#snippet rangee(c: CarteMaquette)}
  {@const depliee = ouverte === c.id}
  <li class={['rangee', c.sorte, { depliee }]}>
    <div class="ligne">
      <button
        type="button"
        class="tete"
        aria-expanded={depliee}
        onclick={() => (ouverte = depliee ? '' : c.id)}
      >
        {#if depliee}<ChevronDown
            size={14}
            strokeWidth={ICON_STROKE}
            aria-hidden="true"
          />{:else}<ChevronRight size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />{/if}
        <span class="marque" aria-hidden="true"></span>
        <span class="type">{c.type}</span>
        <span class="titre">{c.titre}</span>
        <span class="meta">{c.poste} · {c.heure}</span>
      </button>
      {#if c.options}
        <Button variant="doux" size="petit" onclick={() => (ouverte = c.id)}>Répondre</Button>
      {:else}
        <IconButton
          icon={Check}
          label="Valider"
          shortcut="V"
          size="petit"
          variant={c.sorte === 'suppression' ? 'danger' : 'doux'}
        />
      {/if}
    </div>
    {#if depliee}
      <div class="corps">
        {#if c.apercu}
          <blockquote>{c.apercu}</blockquote>
        {:else if c.lignes.length}
          <p class="valeurs">
            {#each c.lignes as [k, v] (k)}<span><i>{k}</i>{v}</span>{/each}
          </p>
        {/if}
        <p class="raison">{c.raison}</p>
        {#if c.envoie}<p class="envoie">{c.envoie}</p>{/if}
        <div class="gestes">
          {#if c.options}
            {#each c.options as o (o)}<Button variant="secondaire" size="petit">{o}</Button>{/each}
            <Button variant="fantome" size="petit">Plus tard</Button>
          {:else}
            <Button variant={c.sorte === 'suppression' ? 'danger' : 'doux'} size="petit" icon={Check}
              >Valider</Button
            >
            <Button variant="secondaire" size="petit" icon={Pencil}>Modifier</Button>
            <Button variant="fantome" size="petit">Refuser</Button>
          {/if}
          <span class="touches" aria-hidden="true"><Kbd>V</Kbd><Kbd>R</Kbd></span>
        </div>
      </div>
    {/if}
  </li>
{/snippet}

<div class="piste">
  <div>
    <p class="etiquette">La file, une carte dépliée</p>
    <ul class="file">
      {#each CARTES as c (c.id)}{@render rangee(c)}{/each}
    </ul>
  </div>
  <div class="cote">
    <div>
      <p class="etiquette">Tranchée</p>
      <ul class="file">
        <li class="rangee faite">
          <div class="ligne">
            <span class="tete">
              <Check size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />
              <span class="titre">{tranchee.fait}</span>
              <span class="meta">{tranchee.heure}</span>
            </span>
            <Button variant="fantome" size="petit" icon={Undo}>Annuler</Button>
          </div>
        </li>
      </ul>
    </div>
    <div>
      <p class="etiquette">Compacte, dans une liste</p>
      <span class="puce">
        <span class="marque" aria-hidden="true"></span>Factures
        <IconButton icon={Check} label="Valider" size="petit" variant="doux" />
      </span>
    </div>
    <div>
      <p class="etiquette">La permission</p>
      <div class="barre" role="group" aria-label="Permission : {PERMISSION.quoi}">
        <Shield size={16} strokeWidth={ICON_STROKE} aria-hidden="true" />
        <p><b>{PERMISSION.quoi}</b><span>{PERMISSION.pourquoi}</span></p>
        <div class="reponses">
          <Button variant="doux" size="petit">{PERMISSION.reponses[0]}</Button>
          <Button variant="fantome" size="petit">Toujours</Button>
          <Button variant="fantome" size="petit">{PERMISSION.reponses[2]}</Button>
        </div>
      </div>
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
  .file {
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid var(--bordure);
    border-radius: var(--r-2);
    background: var(--surface-1);
    overflow: hidden;
  }
  .rangee {
    --ton: var(--ia);
    border-top: 1px solid var(--bordure);
  }
  .rangee:first-child {
    border-top: 0;
  }
  .rangee.question {
    --ton: var(--attention);
  }
  .rangee.suppression {
    --ton: var(--danger);
  }
  .rangee.depliee {
    background: var(--surface-2);
  }
  .ligne {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 10px 6px 6px;
  }
  .tete {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 10px;
    min-width: 0;
    min-height: 34px;
    padding: 0 6px;
    border: 0;
    border-radius: var(--r-1);
    background: none;
    font: inherit;
    color: inherit;
    text-align: left;
  }
  button.tete {
    cursor: pointer;
  }
  button.tete:hover {
    background: var(--survol);
  }
  .marque {
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--ton, var(--ia));
  }
  .type {
    flex: none;
    width: 86px;
    font-size: 11.5px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--texte-3);
  }
  .titre {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    font-size: 13.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .meta {
    flex: none;
    font-size: 12px;
    color: var(--texte-3);
  }
  .corps {
    display: grid;
    gap: 8px;
    padding: 4px 14px 12px 46px;
  }
  .valeurs {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 18px;
    margin: 0;
    font-size: 13px;
  }
  .valeurs i {
    margin-right: 6px;
    font-style: normal;
    color: var(--texte-3);
  }
  blockquote {
    margin: 0;
    padding: 8px 10px;
    border-radius: var(--r-1);
    background: var(--surface-3);
    font-size: 13px;
    color: var(--texte-2);
  }
  .raison {
    margin: 0;
    font-size: 12.5px;
    color: var(--texte-2);
  }
  .envoie {
    margin: 0;
    font-size: 12.5px;
    color: var(--attention);
  }
  .gestes,
  .reponses {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }
  .touches {
    display: flex;
    gap: 4px;
    margin-left: auto;
  }
  .faite .tete {
    color: var(--texte-2);
  }
  .faite .tete :global(svg) {
    color: var(--ok);
  }
  .puce {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 2px 4px 2px 10px;
    border: 1px solid var(--ia-bord);
    border-radius: var(--r-rond);
    background: var(--ia-doux);
    font-size: 12.5px;
  }
  .barre {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
    padding: 10px 12px;
    border: 1px solid var(--accent-bord);
    border-radius: var(--r-2);
    background: var(--surface-2);
    box-shadow: var(--ombre-2);
  }
  .barre :global(svg:first-child) {
    flex: none;
    color: var(--accent-texte);
  }
  .barre p {
    display: grid;
    flex: 1;
    min-width: 160px;
    margin: 0;
    font-size: 13px;
  }
  .barre b {
    font-weight: 500;
  }
  .barre p span {
    font-size: 12px;
    color: var(--texte-3);
  }
  @media (max-width: 900px) {
    .piste {
      grid-template-columns: minmax(0, 1fr);
    }
    .type,
    .meta {
      display: none;
    }
  }
</style>
