<script lang="ts">
  import Banner from '../../kit/Banner.svelte';
  import Button from '../../kit/Button.svelte';
  import CommandPalette from '../../kit/CommandPalette.svelte';
  import ConfirmDialog from '../../kit/ConfirmDialog.svelte';
  import Dialog from '../../kit/Dialog.svelte';
  import * as icons from '../../kit/Icon.ts';
  import Toaster from '../../kit/Toaster.svelte';
  import { toast } from '../../kit/toasts.svelte.ts';
  import Tooltip from '../../kit/Tooltip.svelte';
  import type { PaletteCommand } from '../../kit/types.ts';
  import Groupe from '../Groupe.svelte';
  import Piece from '../Piece.svelte';
  import Section from '../Section.svelte';

  const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
  let palette = $state(false);
  const COMMANDES: PaletteCommand[] = [
    {
      id: 'pause',
      label: 'Mettre en pause',
      group: 'Action',
      icon: icons.Pause,
      run: () => toast('En pause.'),
    },
    { id: 'journal', label: 'Journal', group: 'Aller à', icon: icons.Scroll, run: () => {} },
    { id: 'reglages', label: 'Réglages', group: 'Aller à', icon: icons.Settings, run: () => {} },
  ];
</script>

<Section
  id="calques"
  titre="Ce qui flotte"
  intro="Les calques posés au-dessus de l’écran. Ils sortent de la vue : ils recopient son monde pour garder son accent. Change de monde, puis rouvre-les."
>
  <Groupe
    titre="Nommer au survol"
    sens="L’info-bulle dit ce qu’un contrôle sans texte fait, et son raccourci."
  >
    <Piece nom="Tooltip" etat="au survol ou au focus">
      <Tooltip label="Archiver" shortcut="E">
        {#snippet children({ props })}<Button variant="secondaire" {...props}>Survole-moi</Button>{/snippet}
      </Tooltip>
    </Piece>
    <Piece nom="Tooltip" etat="à droite">
      <Tooltip label="Ouvrir le fil" side="right">
        {#snippet children({ props })}<Button variant="fantome" {...props}>À droite</Button>{/snippet}
      </Tooltip>
    </Piece>
  </Groupe>

  <Groupe
    titre="Demander avant d’agir"
    sens="Le dialogue pour un contenu ; la confirmation pour ce qui ne se rattrape pas."
  >
    <Piece nom="Dialog" etat="fermé, à ouvrir">
      <Dialog title="Relier un poste" description="Le code s’affiche sur le poste à relier.">
        {#snippet trigger({ props })}<Button variant="secondaire" {...props}>Ouvrir le dialogue</Button
          >{/snippet}
        {#snippet children()}<p class="texte">
            Le contenu du dialogue : un champ, une liste, un texte.
          </p>{/snippet}
        {#snippet footer({ close })}
          <Button variant="fantome" onclick={close}>Annuler</Button>
          <Button variant="principal" onclick={close}>Relier</Button>
        {/snippet}
      </Dialog>
    </Piece>
    <Piece nom="ConfirmDialog" etat="danger">
      <ConfirmDialog
        title="Révoquer cet appareil ?"
        message="Il devra être appairé de nouveau pour entrer."
        confirmLabel="Révoquer"
        onconfirm={() => wait(400)}
      >
        {#snippet trigger({ props })}<Button variant="danger" {...props}>Révoquer</Button>{/snippet}
      </ConfirmDialog>
    </Piece>
    <Piece nom="ConfirmDialog" etat="danger plein">
      <ConfirmDialog
        title="Effacer la base ?"
        message="Toutes les fiches sont supprimées. Rien ne les ramène."
        confirmLabel="Effacer"
        confirmVariant="danger-plein"
        onconfirm={() => wait(400)}
      >
        {#snippet trigger({ props })}<Button variant="danger" {...props}>Effacer la base</Button>{/snippet}
      </ConfirmDialog>
    </Piece>
  </Groupe>

  <Groupe titre="Chercher une commande" sens="Une seule palette par page ; Ctrl K l’ouvre de partout.">
    <Piece nom="CommandPalette" etat="fermée, à ouvrir">
      <Button variant="secondaire" icon={icons.Search} onclick={() => (palette = true)}
        >Ouvrir la palette</Button
      >
    </Piece>
  </Groupe>

  <Groupe
    titre="Dire ce qui vient de se passer"
    sens="Un toast à la fois. Un geste annulable reste 5 s ; une erreur qui attend passe avant une information."
  >
    <Piece nom="Toaster" etat="information">
      <Button variant="secondaire" size="petit" onclick={() => toast('Réglage enregistré.')}
        >Toast simple</Button
      >
    </Piece>
    <Piece nom="Toaster" etat="annulable">
      <Button
        variant="secondaire"
        size="petit"
        onclick={() => toast('3 mails rangés dans Factures', { undo: () => wait(400) })}
        >Toast annulable</Button
      >
    </Piece>
    <Piece nom="Toaster" etat="erreur">
      <Button variant="secondaire" size="petit" onclick={() => toast('L’envoi a échoué.', { tone: 'danger' })}
        >Toast d’erreur</Button
      >
    </Piece>
    <Piece nom="Toaster" etat="annulation refusée">
      <Button
        variant="secondaire"
        size="petit"
        onclick={() =>
          toast('Rangé dans Administratif', {
            undo: () => wait(300).then(() => Promise.reject(new Error('Trop tard pour annuler.'))),
          })}>Annulation refusée</Button
      >
    </Piece>
  </Groupe>

  <Groupe titre="Dire ce qui dure" sens="Le bandeau reste tant que l’état dure, avec un seul bouton." colonne>
    <Piece nom="Banner" etat="danger" large>
      <Banner title="Clé refusée : le tri par l’agent est en pause.">
        Les règles continuent de s’appliquer.
        {#snippet action()}<Button variant="principal" size="petit">Remplacer la clé</Button>{/snippet}
      </Banner>
    </Piece>
    <Piece nom="Banner" etat="attention" large>
      <Banner tone="attention" title="La clé expire dans 10 jours.">Échéance déclarée : 12 mars 2027.</Banner>
    </Piece>
    <Piece nom="Banner" etat="info" large>
      <Banner tone="info" title="En pause depuis 14:15." icon={icons.Pause}
        >Rien d’automatique ne tourne.</Banner
      >
    </Piece>
  </Groupe>
</Section>

<CommandPalette bind:open={palette} commands={COMMANDES} placeholder="Chercher une commande" />
<Toaster />

<style>
  .texte {
    margin: 0;
    font-size: 14px;
    color: var(--texte-2);
  }
</style>
