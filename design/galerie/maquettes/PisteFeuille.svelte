<script lang="ts">
  import Button from '../../kit/Button.svelte';
  import { Check, ICON_STROKE, Pencil, Shield, Undo } from '../../kit/Icon.ts';
  import Kbd from '../../kit/Kbd.svelte';
  import { CARTES, PERMISSION, type CarteMaquette } from './donnees.ts';

  /*
   * Direction A, « La feuille »: each card is a small sheet that says everything without a gesture. A filet in the
   * tone of what it is, an eyebrow (kind, post, time), a serif title, the values in two columns, the reason set
   * apart, then the gestures. Made to be read; takes room.
   */
  const tranchee = CARTES[0]!;
</script>

{#snippet feuille(c: CarteMaquette)}
  <article class={['feuille', c.sorte]} aria-label="{c.type} : {c.titre}">
    <p class="surtitre">
      <span class="type">{c.type}</span><span>{c.poste}</span><span>{c.heure}</span>
    </p>
    <h4>{c.titre}</h4>
    {#if c.apercu}
      <blockquote>{c.apercu}</blockquote>
    {:else if c.lignes.length}
      <dl>
        {#each c.lignes as [k, v] (k)}<dt>{k}</dt>
          <dd>{v}</dd>{/each}
      </dl>
    {/if}
    <p class="raison"><span>Pourquoi</span>{c.raison}</p>
    {#if c.envoie}<p class="envoie">{c.envoie}</p>{/if}
    <div class="gestes">
      {#if c.options}
        {#each c.options as o, i (o)}
          <Button variant={i === 0 ? 'principal' : 'secondaire'} size="petit">{o}</Button>
        {/each}
        <Button variant="fantome" size="petit">Plus tard</Button>
      {:else}
        <Button variant={c.sorte === 'suppression' ? 'danger' : 'principal'} size="petit" icon={Check}
          >Valider</Button
        >
        <Button variant="secondaire" size="petit" icon={Pencil}>Modifier</Button>
        <Button variant="fantome" size="petit">Refuser</Button>
      {/if}
      <span class="touches" aria-hidden="true"><Kbd>V</Kbd><Kbd>R</Kbd></span>
    </div>
  </article>
{/snippet}

<div class="piste">
  <div class="file">
    {#each CARTES as c (c.id)}{@render feuille(c)}{/each}
  </div>
  <div class="cote">
    <div>
      <p class="etiquette">Tranchée</p>
      <div class="faite">
        <Check size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />
        <span>{tranchee.fait} · {tranchee.heure}</span>
        <Button variant="fantome" size="petit" icon={Undo}>Annuler</Button>
      </div>
    </div>
    <div>
      <p class="etiquette">Compacte, dans une liste</p>
      <div class="compacte">
        <span class="type">{tranchee.type}</span><span class="quoi">Factures</span>
        <Button variant="doux" size="petit" icon={Check}>Valider</Button>
      </div>
    </div>
    <div>
      <p class="etiquette">La permission</p>
      <article class="feuille permission" aria-label="Permission : {PERMISSION.quoi}">
        <p class="surtitre">
          <span class="type">Permission</span><span>Ce poste</span><span>maintenant</span>
        </p>
        <h4><Shield size={16} strokeWidth={ICON_STROKE} aria-hidden="true" />{PERMISSION.quoi}</h4>
        <dl>
          <dt>Cible</dt>
          <dd><code>{PERMISSION.cible}</code></dd>
        </dl>
        <p class="raison"><span>Pourquoi</span>{PERMISSION.pourquoi}</p>
        <div class="gestes">
          <Button variant="principal" size="petit">{PERMISSION.reponses[0]}</Button>
          <Button variant="secondaire" size="petit">{PERMISSION.reponses[1]}</Button>
          <Button variant="fantome" size="petit">{PERMISSION.reponses[2]}</Button>
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
  .file,
  .cote {
    display: grid;
    gap: 14px;
  }
  .cote {
    gap: 22px;
  }
  .etiquette {
    margin: 0 0 8px;
    font: 500 11.5px/1.3 var(--sans);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--texte-3);
  }
  .feuille {
    --filet: var(--ia);
    display: grid;
    gap: 10px;
    padding: 16px 18px 14px;
    border: 1px solid var(--bordure);
    border-top: 2px solid var(--filet);
    border-radius: var(--r-2);
    background: var(--surface-1);
  }
  .feuille.question {
    --filet: var(--attention);
  }
  .feuille.suppression {
    --filet: var(--danger);
  }
  .feuille.permission {
    --filet: var(--accent-texte);
  }
  .surtitre {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    margin: 0;
    font-size: 12px;
    color: var(--texte-3);
  }
  .type {
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--filet, var(--ia));
  }
  h4 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font: 500 21px/1.2 var(--serif);
  }
  dl {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    gap: 3px 16px;
    margin: 0;
    font-size: 13.5px;
  }
  dt {
    color: var(--texte-3);
  }
  dd {
    margin: 0;
  }
  code {
    font:
      12.5px ui-monospace,
      Consolas,
      monospace;
    overflow-wrap: anywhere;
  }
  blockquote {
    margin: 0;
    padding: 10px 12px;
    border-radius: var(--r-1);
    background: var(--surface-2);
    font-size: 13.5px;
    color: var(--texte-2);
  }
  .raison {
    margin: 0;
    padding-left: 10px;
    border-left: 2px solid var(--bordure-forte);
    font-size: 13px;
    color: var(--texte-2);
  }
  .raison span {
    margin-right: 8px;
    font-size: 11.5px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--texte-3);
  }
  .envoie {
    margin: 0;
    font-size: 12.5px;
    color: var(--attention);
  }
  .gestes {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding-top: 4px;
  }
  .touches {
    display: flex;
    gap: 4px;
    margin-left: auto;
  }
  .faite,
  .compacte {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border: 1px solid var(--bordure);
    border-radius: var(--r-2);
    font-size: 13px;
    color: var(--texte-2);
  }
  .faite span,
  .compacte .quoi {
    flex: 1;
    min-width: 0;
  }
  .faite :global(svg:first-child) {
    color: var(--ok);
  }
  @media (max-width: 900px) {
    .piste {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
