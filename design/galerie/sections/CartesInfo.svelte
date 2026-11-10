<script lang="ts">
  import Button from '../../kit/Button.svelte';
  import CodeInput from '../../kit/CodeInput.svelte';
  import Field from '../../kit/Field.svelte';
  import ServiceCard from '../../kit/ServiceCard.svelte';
  import StandaloneCard from '../../kit/StandaloneCard.svelte';
  import StatCard from '../../kit/StatCard.svelte';
  import Steps from '../../kit/Steps.svelte';
  import Groupe from '../Groupe.svelte';
  import Piece from '../Piece.svelte';
  import Section from '../Section.svelte';
</script>

<Section
  id="cartes-info"
  titre="Cartes d’information"
  intro="Des cartes qui disent un chiffre, l’état d’un service, ou portent un écran seul. Elles n’attendent aucune décision : ce ne sont pas les cartes du dictionnaire, qui viennent au palier suivant."
>
  <Groupe
    titre="Un chiffre et où il mène"
    colonnes={3}
    sens="Le compte de ce qui attend, avec le lien qui y conduit."
  >
    <Piece nom="StatCard" etat="principale">
      <StatCard
        label="Brouillons à valider"
        value={7}
        sub="dont 3 de cette nuit"
        href="#cartes-info"
        action="Passer en revue"
        primary
      />
    </Piece>
    <Piece nom="StatCard" etat="neutre">
      <StatCard label="Fiches" value={248} href="#cartes-info" action="Ouvrir" />
    </Piece>
    <Piece nom="StatCard" etat="danger">
      <StatCard label="Contradictions" value={2} tone="danger" href="#cartes-info" action="Trancher" />
    </Piece>
  </Groupe>

  <Groupe
    titre="L’état d’un service"
    colonnes={4}
    sens="Au bas d’un rail : il tourne, il est en pause, sa clé est refusée."
  >
    <Piece nom="ServiceCard" etat="actif"
      ><ServiceCard state="actif" detail="Synchronisé il y a 1 min" /></Piece
    >
    <Piece nom="ServiceCard" etat="pause"><ServiceCard state="pause" detail="Mis en pause à 08:40" /></Piece>
    <Piece nom="ServiceCard" etat="pause, titre à soi">
      <ServiceCard state="pause" title="Tri par les règles" detail="Aucun fournisseur en service" />
    </Piece>
    <Piece nom="ServiceCard" etat="clé refusée"
      ><ServiceCard state="cle-refusee" detail="Clé refusée" /></Piece
    >
  </Groupe>

  <Groupe
    titre="Un écran seul"
    sens="L’appairage, l’autorisation : une carte au milieu de la page, hors de toute navigation. Elle rend son propre « main »."
    colonne
  >
    <Piece nom="StandaloneCard" etat="normal" large>
      <StandaloneCard
        title="Appairer ce navigateur"
        lead="Saisis le code à 6 chiffres. Il ne sert qu’une fois."
        brand="Lun’"
      >
        <Field label="Code d’appareil" hint="Le code peut être collé tel quel.">
          {#snippet children(c)}<CodeInput
              aria-describedby={c.describedBy}
              aria-label="Code d’appareil"
              value="482"
            />{/snippet}
        </Field>
        {#snippet footer()}<Button variant="principal" size="grand" disabled>Entrer</Button>{/snippet}
      </StandaloneCard>
    </Piece>
    <Piece nom="StandaloneCard" etat="avec ses étapes, en erreur" large>
      <StandaloneCard title="Autoriser l’application" lead="La même carte, code refusé." brand="Lun’">
        {#snippet steps()}<Steps steps={['Navigateur appairé', 'Autoriser']} current={1} />{/snippet}
        <Field label="Code d’appareil" error="Code incorrect ou expiré. Demande un nouveau code.">
          {#snippet children(c)}
            <CodeInput aria-describedby={c.describedBy} aria-label="Code d’appareil" value="482917" error />
          {/snippet}
        </Field>
        {#snippet footer()}<Button variant="principal" size="grand">Réessayer</Button>{/snippet}
      </StandaloneCard>
    </Piece>
  </Groupe>
</Section>
