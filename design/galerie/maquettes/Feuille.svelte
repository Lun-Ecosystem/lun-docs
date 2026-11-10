<script lang="ts">
  import Button from '../../kit/Button.svelte';
  import { Check, Clock, ICON_STROKE, Pencil, TriangleAlert, Undo, X } from '../../kit/Icon.ts';
  import Kbd from '../../kit/Kbd.svelte';
  import TextArea from '../../kit/TextArea.svelte';
  import TextInput from '../../kit/TextInput.svelte';
  import type { CarteMaquette, EtatCarte } from './donnees.ts';

  /*
   * The card, as a sheet (the direction kept): it says everything without a gesture. A mock-up, not a kit
   * component: each state is drawn, none is wired.
   */
  type Props = {
    carte: CarteMaquette;
    etat?: EtatCarte | undefined;
    /** In a conversation or a side panel: smaller title, no shortcut hints. */
    etroite?: boolean | undefined;
  };
  let { carte: c, etat = 'attente', etroite = false }: Props = $props();

  const occupee = $derived(etat === 'occupee');
  const modif = $derived(etat === 'modification');
</script>

{#if etat === 'tranchee' || etat === 'refusee'}
  <div class={['f-ligne', { ok: etat === 'tranchee' }]}>
    {#if etat === 'tranchee'}
      <Check size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />
      <span>{c.fait} · {c.heure}</span>
    {:else}
      <X size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />
      <span>Refusée : {c.titre}</span>
    {/if}
    <Button variant="fantome" size="petit" icon={Undo}>Annuler</Button>
  </div>
{:else}
  <article
    class={['feuille', c.sorte, etat, { etroite }]}
    aria-label="{c.type} : {c.titre}"
    aria-busy={occupee}
  >
    <p class="f-surtitre">
      <span class="f-type">{c.type}</span><span>{c.poste}</span><span>{c.heure}</span>
    </p>
    <h4>{c.titre}</h4>
    {#if c.apercu}
      {#if modif}
        <TextArea value={c.apercu} rows={3} aria-label="Texte du brouillon" />
      {:else}
        <blockquote>{c.apercu}</blockquote>
      {/if}
    {:else if c.lignes.length}
      <dl>
        {#each c.lignes as [k, v] (k)}<dt>{k}</dt>
          <dd>
            {#if modif}<TextInput value={v} size="petit" aria-label={k} />{:else}{v}{/if}
          </dd>{/each}
      </dl>
    {/if}
    <p class="f-raison"><span>Pourquoi</span>{c.raison}</p>
    {#if etat === 'echec'}
      <p class="f-note danger" role="alert">
        <TriangleAlert size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />
        N’a pas abouti : {c.echec} Rien n’a été modifié.
      </p>
    {:else if etat === 'expiree'}
      <p class="f-note calme">
        <Clock size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />
        Expirée : {c.expire}
      </p>
    {:else if c.envoie}
      <p class="f-note">{c.envoie}</p>
    {/if}
    <div class="f-gestes">
      {#if etat === 'expiree'}
        <Button variant="fantome" size="petit" icon={X}>Retirer de la file</Button>
      {:else if modif}
        <Button variant="principal" size="petit" icon={Check}>Valider ainsi</Button>
        <Button variant="fantome" size="petit">Annuler la modification</Button>
      {:else if c.options}
        {#each c.options as o, i (o)}
          <Button
            variant={i === 0 ? 'principal' : 'secondaire'}
            size="petit"
            loading={occupee && i === 0}
            disabled={occupee && i !== 0}>{o}</Button
          >
        {/each}
        <Button variant="fantome" size="petit" disabled={occupee}>Plus tard</Button>
      {:else}
        <Button
          variant={c.sorte === 'suppression' ? 'danger' : 'principal'}
          size="petit"
          icon={Check}
          loading={occupee}>{etat === 'echec' ? 'Réessayer' : 'Valider'}</Button
        >
        <Button variant="secondaire" size="petit" icon={Pencil} disabled={occupee}>Modifier</Button>
        <Button variant="fantome" size="petit" disabled={occupee}>Refuser</Button>
      {/if}
      {#if etat === 'attente' && !etroite && !c.options}
        <span class="f-touches" aria-hidden="true"><Kbd>V</Kbd><Kbd>R</Kbd></span>
      {/if}
    </div>
  </article>
{/if}
