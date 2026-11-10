<script lang="ts">
  import Badge from '../../kit/Badge.svelte';
  import Button from '../../kit/Button.svelte';
  import Checkbox from '../../kit/Checkbox.svelte';
  import EmptyState from '../../kit/EmptyState.svelte';
  import * as icons from '../../kit/Icon.ts';
  import IconButton from '../../kit/IconButton.svelte';
  import ListRow from '../../kit/ListRow.svelte';
  import SettingsCard from '../../kit/SettingsCard.svelte';
  import SettingsRow from '../../kit/SettingsRow.svelte';
  import Skeleton from '../../kit/Skeleton.svelte';
  import Steps from '../../kit/Steps.svelte';
  import Switch from '../../kit/Switch.svelte';
  import Groupe from '../Groupe.svelte';
  import Piece from '../Piece.svelte';
  import Section from '../Section.svelte';
</script>

{#snippet ligne(de: string, quand: string, objet: string, suite: string)}
  <div class="l1"><span class="de">{de}</span><span class="heure">{quand}</span></div>
  <div class="l2"><b>{objet}</b> · {suite}</div>
{/snippet}

<Section
  id="listes"
  titre="Listes et réglages"
  intro="Ce qui range du contenu : une ligne de liste, une carte de réglages et ses rangs, puis ce qui se montre quand il n’y a rien, ou pas encore."
>
  <Groupe titre="Une ligne de liste" sens="Lue ou non, sélectionnée, et ses actions au survol." colonne>
    <Piece nom="ListRow" etat="non lue" large>
      <ListRow onopen={() => {}}>
        {#snippet start()}<Checkbox aria-label="Sélectionner" />{/snippet}
        {@render ligne('Opérateur mobile', '09:12', 'Votre facture d’octobre', 'Montant 19,99 €')}
      </ListRow>
    </Piece>
    <Piece nom="ListRow" etat="sélectionnée" large>
      <ListRow selected>
        {#snippet start()}<Checkbox aria-label="Sélectionner" checked />{/snippet}
        {@render ligne('Compte test', '00:28', 'Essai de clé', 'Message de test')}
      </ListRow>
    </Piece>
    <Piece nom="ListRow" etat="lue · survol, avec ses actions" large>
      <ListRow read data-etat="survol">
        {#snippet start()}<Checkbox aria-label="Sélectionner" />{/snippet}
        {@render ligne('Hébergeur', 'hier', 'Alerte de sécurité', 'Nouvelle connexion')}
        {#snippet actions()}
          <IconButton icon={icons.Archive} label="Archiver" shortcut="E" size="petit" />
          <IconButton icon={icons.Trash} label="Mettre à la corbeille" size="petit" />
        {/snippet}
      </ListRow>
    </Piece>
  </Groupe>

  <Groupe
    titre="Une carte de réglages"
    sens="Un titre, ce qu’elle règle, puis un rang par réglage : le libellé, l’aide, le contrôle."
    colonne
  >
    <Piece nom="SettingsCard" etat="avec SettingsRow" large>
      <SettingsCard title="Compte" description="Ce que l’agent peut lire et modifier.">
        {#snippet aside()}<Badge tone="ok" dot>Connecté</Badge>{/snippet}
        <SettingsRow label="compte.test@example.com" hint="Relié le 14 sept. 2026" />
        <SettingsRow label="Accès" hint="Lecture et modification">
          <Button variant="fantome" size="petit">Détails</Button>
        </SettingsRow>
        <SettingsRow label="Tri automatique" hint="Range seul au-dessus du seuil.">
          {#snippet children({ labelId })}<Switch checked aria-labelledby={labelId} />{/snippet}
        </SettingsRow>
        <SettingsRow label="Seuil" error="Entre 50 et 100.">
          <Button variant="secondaire" size="petit">Corriger</Button>
        </SettingsRow>
      </SettingsCard>
    </Piece>
  </Groupe>

  <Groupe
    titre="Quand il n’y a rien"
    colonnes={3}
    sens="L’état vide dit ce qui viendra ici, et le geste qui le fait venir."
  >
    <Piece nom="EmptyState" etat="neutre">
      <EmptyState
        title="Rien encore aujourd’hui."
        message="Ce que vous vous dites s’écrit ici."
        icon={icons.Inbox}
      />
    </Piece>
    <Piece nom="EmptyState" etat="ok, avec un geste">
      <EmptyState title="Tout est tranché." message="Aucune carte n’attend." icon={icons.Check} tone="ok">
        <Button variant="secondaire" size="petit">Voir le journal</Button>
      </EmptyState>
    </Piece>
    <Piece nom="EmptyState" etat="grand">
      <EmptyState
        title="Aucune fiche."
        message="Dépose un coffre pour commencer."
        icon={icons.Library}
        size="grand"
      />
    </Piece>
  </Groupe>

  <Groupe titre="Quand ça charge" sens="La forme de ce qui arrive, pas une roue.">
    <Piece nom="Skeleton" etat="lignes">
      <div class="os">
        <Skeleton width="70%" />
        <Skeleton width="45%" />
        <Skeleton width="60%" height={10} />
      </div>
    </Piece>
    <Piece nom="Skeleton" etat="rond"><Skeleton shape="rond" /></Piece>
  </Groupe>

  <Groupe titre="Où on en est" colonnes={1} sens="Les étapes d’un parcours court.">
    <Piece nom="Steps" etat="première"><Steps steps={['Appareil reconnu', 'Autoriser']} current={0} /></Piece>
    <Piece nom="Steps" etat="seconde"><Steps steps={['Appareil reconnu', 'Autoriser']} current={1} /></Piece>
    <Piece nom="Steps" etat="trois étapes"
      ><Steps steps={['Clé', 'Plafonds', 'Premier poste']} current={1} /></Piece
    >
  </Groupe>
</Section>

<style>
  .l1 {
    display: flex;
    gap: 10px;
    font-size: 13.5px;
  }
  .de {
    flex: 1;
    min-width: 0;
    font-weight: 500;
  }
  .heure {
    color: var(--texte-3);
    font-size: 12.5px;
  }
  .l2 {
    font-size: 13px;
    color: var(--texte-2);
  }
  .l2 b {
    font-weight: 400;
    color: var(--texte);
  }
  .os {
    display: grid;
    gap: 8px;
    width: 220px;
  }
</style>
