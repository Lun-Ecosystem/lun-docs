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
  id="tuiles"
  titre="Tuiles et écrans seuls"
  intro="Ce qui dit un chiffre ou l’état d’un service, et le panneau qui porte un écran à lui seul. Rien ici n’attend une décision : la carte, au sens du dictionnaire, est une autre famille."
>
  <Groupe
    titre="Un chiffre et où il mène"
    sens="Le compte de ce qui attend, avec le lien qui y conduit."
    colonnes={3}
  >
    <Piece nom="StatCard" etat="principale">
      <StatCard
        label="Brouillons à valider"
        value={7}
        sub="dont 3 du dernier lot"
        href="#tuiles"
        action="Passer en revue"
        primary
      />
    </Piece>
    <Piece nom="StatCard" etat="neutre">
      <StatCard label="Fiches" value={248} href="#tuiles" action="Ouvrir" />
    </Piece>
    <Piece nom="StatCard" etat="danger">
      <StatCard label="Contradictions" value={2} tone="danger" href="#tuiles" action="Trancher" />
    </Piece>
  </Groupe>

  <Groupe
    titre="L’état d’un service"
    sens="Au bas d’un rail : il tourne, il est arrêté, sa clé est refusée."
    colonnes={4}
  >
    <Piece nom="ServiceCard" etat="actif">
      <ServiceCard state="actif" detail="Synchronisé il y a 1 min" />
    </Piece>
    <Piece nom="ServiceCard" etat="pause"><ServiceCard state="pause" detail="Arrêté à 08:40" /></Piece>
    <Piece nom="ServiceCard" etat="pause, titre à soi">
      <ServiceCard state="pause" title="Tri par les règles" detail="Aucun fournisseur en service" />
    </Piece>
    <Piece nom="ServiceCard" etat="clé refusée">
      <ServiceCard state="cle-refusee" detail="Clé refusée" />
    </Piece>
  </Groupe>

  <Groupe
    titre="Un écran seul"
    sens="L’appairage, l’autorisation : un panneau au milieu de la page, hors de toute navigation. Il rend son propre « main » et son propre titre de page."
    colonne
  >
    <Piece nom="StandaloneCard" etat="normal" large>
      <StandaloneCard
        title="Appairer ce navigateur"
        lead="Le code à 6 chiffres ne sert qu’une fois."
        brand="Lun’"
      >
        <Field label="Code d’appareil" hint="Le code peut être collé tel quel.">
          {#snippet children(c)}
            <CodeInput aria-describedby={c.describedBy} aria-label="Code d’appareil" value="482" />
          {/snippet}
        </Field>
        {#snippet footer()}<Button variant="principal" size="grand" disabled>Entrer</Button>{/snippet}
      </StandaloneCard>
    </Piece>
    <Piece nom="StandaloneCard" etat="avec ses étapes, en erreur" large>
      <StandaloneCard title="Autoriser l’application" lead="Le même panneau, code refusé." brand="Lun’">
        {#snippet steps()}<Steps steps={['Navigateur appairé', 'Autoriser']} current={1} />{/snippet}
        <Field label="Code d’appareil" error="Code incorrect ou expiré. Un nouveau code est nécessaire.">
          {#snippet children(c)}
            <CodeInput aria-describedby={c.describedBy} aria-label="Code d’appareil" value="482917" error />
          {/snippet}
        </Field>
        {#snippet footer()}<Button variant="principal" size="grand">Réessayer</Button>{/snippet}
      </StandaloneCard>
    </Piece>
  </Groupe>
</Section>
