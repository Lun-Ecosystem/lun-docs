<script lang="ts">
  import Button from '../../kit/Button.svelte';
  import { Check, Clock, ICON_STROKE, Shield, X } from '../../kit/Icon.ts';
  import { PERMISSION, type EtatPermission } from './donnees.ts';

  /*
   * The permission: an immediate action on the post, which waits for an answer (once, always, refuse). The same
   * sheet as a card, shorter, in the color of the world: it is not a proposal waiting in a queue.
   */
  let { etat = 'attente' }: { etat?: EtatPermission | undefined } = $props();
  const p = PERMISSION;
  const occupee = $derived(etat === 'occupee');
</script>

{#if etat === 'attente' || etat === 'occupee'}
  <article class="feuille permission" aria-label="Permission : {p.quoi}" aria-busy={occupee}>
    <p class="f-surtitre">
      <span class="f-type">Permission</span><span>{p.poste}</span><span>maintenant</span>
    </p>
    <h4><Shield size={16} strokeWidth={ICON_STROKE} aria-hidden="true" />{p.quoi}</h4>
    <dl>
      <dt>Cible</dt>
      <dd><code>{p.cible}</code></dd>
    </dl>
    <p class="f-raison"><span>Pourquoi</span>{p.pourquoi}</p>
    <div class="f-gestes">
      <Button variant="principal" size="petit" loading={occupee}>{p.reponses[0]}</Button>
      <Button variant="secondaire" size="petit" disabled={occupee}>{p.reponses[1]}</Button>
      <Button variant="fantome" size="petit" disabled={occupee}>{p.reponses[2]}</Button>
    </div>
  </article>
{:else}
  <div class={['f-ligne', { ok: etat === 'une-fois' || etat === 'toujours' }]}>
    {#if etat === 'une-fois'}
      <Check size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />
      <span>Autorisé une fois : {p.quoi}</span>
    {:else if etat === 'toujours'}
      <Check size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />
      <span>Toujours autorisé pour ce dossier : {p.quoi}</span>
      <Button variant="fantome" size="petit">Retirer</Button>
    {:else if etat === 'refusee'}
      <X size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />
      <span>Refusé : {p.quoi}</span>
    {:else}
      <Clock size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />
      <span>Sans réponse : l’action n’a pas eu lieu.</span>
    {/if}
  </div>
{/if}
