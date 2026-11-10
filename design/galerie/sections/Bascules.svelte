<script lang="ts">
  import Badge from '../../kit/Badge.svelte';
  import Checkbox from '../../kit/Checkbox.svelte';
  import Chip from '../../kit/Chip.svelte';
  import * as icons from '../../kit/Icon.ts';
  import Switch from '../../kit/Switch.svelte';
  import type { Tone } from '../../kit/types.ts';
  import Groupe from '../Groupe.svelte';
  import Piece from '../Piece.svelte';
  import Section from '../Section.svelte';

  const TONS: { tone: Tone; mot: string }[] = [
    { tone: 'ok', mot: 'Connecté' },
    { tone: 'attention', mot: 'Expire bientôt' },
    { tone: 'danger', mot: 'Clé refusée' },
    { tone: 'info', mot: 'En pause' },
    { tone: 'ia', mot: 'Proposé' },
    { tone: 'accent', mot: 'Nouveau' },
    { tone: 'neutre', mot: 'Brouillon' },
  ];
  let filtre = $state(true);
</script>

<Section
  id="bascules"
  titre="Bascules et pastilles"
  intro="Ce qui s’allume ou se coche, et ce qui dit un état ou filtre une liste."
>
  <Groupe titre="Allumer ou éteindre" sens="La bascule agit tout de suite ; la case se coche avant un geste.">
    <Piece nom="Switch" etat="éteint"><Switch label="Filtre dans la scène" /></Piece>
    <Piece nom="Switch" etat="allumé"><Switch label="Filtre dans la scène" checked /></Piece>
    <Piece nom="Switch" etat="survol"><Switch label="Filtre" data-etat="survol" /></Piece>
    <Piece nom="Switch" etat="focus"><Switch label="Filtre" checked data-etat="focus" /></Piece>
    <Piece nom="Switch" etat="désactivé"><Switch label="Filtre" checked disabled /></Piece>
    <Piece nom="Checkbox" etat="vide"><Checkbox label="Sélectionner" /></Piece>
    <Piece nom="Checkbox" etat="cochée"><Checkbox label="Sélectionner" checked /></Piece>
    <Piece nom="Checkbox" etat="partielle"><Checkbox label="Tout sélectionner" indeterminate /></Piece>
    <Piece nom="Checkbox" etat="survol"><Checkbox label="Sélectionner" data-etat="survol" /></Piece>
    <Piece nom="Checkbox" etat="focus"><Checkbox label="Sélectionner" data-etat="focus" /></Piece>
    <Piece nom="Checkbox" etat="désactivée"><Checkbox label="Sélectionner" checked disabled /></Piece>
  </Groupe>

  <Groupe
    titre="Dire un état"
    colonnes={7}
    sens="Sept tons : la couleur, son fond doux, sa bordure. « ia » marque ce que l’agent a proposé."
  >
    {#each TONS as { tone, mot } (tone)}
      <Piece nom="Badge" etat={tone}><Badge {tone}>{mot}</Badge></Piece>
    {/each}
    <Piece nom="Badge" etat="avec point"><Badge tone="ok" dot>Connecté</Badge></Piece>
    <Piece nom="Badge" etat="avec icône"><Badge tone="ia" icon={icons.Sparkles}>Proposé</Badge></Piece>
  </Groupe>

  <Groupe titre="Filtrer une liste" sens="Une pastille par filtre, pressée ou non, avec son compte.">
    <Piece nom="Chip" etat="éteinte"><Chip>Non lus</Chip></Piece>
    <Piece nom="Chip" etat="pressée"
      ><Chip on={filtre} onclick={() => (filtre = !filtre)}>Urgents</Chip></Piece
    >
    <Piece nom="Chip" etat="compte"><Chip count={12}>À valider</Chip></Piece>
    <Piece nom="Chip" etat="icône"><Chip icon={icons.Tag} on>Factures</Chip></Piece>
    <Piece nom="Chip" etat="survol"><Chip data-etat="survol">Non lus</Chip></Piece>
    <Piece nom="Chip" etat="focus"><Chip data-etat="focus">Non lus</Chip></Piece>
    <Piece nom="Chip" etat="désactivée"><Chip disabled>Archivés</Chip></Piece>
  </Groupe>
</Section>
