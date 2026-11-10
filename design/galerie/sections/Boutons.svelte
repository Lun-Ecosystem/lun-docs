<script lang="ts">
  import Button from '../../kit/Button.svelte';
  import * as icons from '../../kit/Icon.ts';
  import IconButton from '../../kit/IconButton.svelte';
  import Kbd from '../../kit/Kbd.svelte';
  import type { ButtonVariant } from '../../kit/types.ts';
  import Groupe from '../Groupe.svelte';
  import Piece from '../Piece.svelte';
  import Section from '../Section.svelte';

  /* Buttons by what the action is, then by variant, then by size; the icon alone and the key last. */
  const ACTIONS: { titre: string; sens: string; variantes: { v: ButtonVariant; mot: string }[] }[] = [
    {
      titre: 'L’action principale',
      sens: 'Une seule par zone : ce que la personne est venue faire.',
      variantes: [{ v: 'principal', mot: 'Valider' }],
    },
    {
      titre: 'L’action secondaire',
      sens: 'À côté de la principale, ou seule dans une ligne.',
      variantes: [
        { v: 'secondaire', mot: 'Modifier' },
        { v: 'doux', mot: 'Reprendre' },
      ],
    },
    {
      titre: 'L’action discrète',
      sens: 'Ce qui doit rester possible sans attirer l’œil.',
      variantes: [{ v: 'fantome', mot: 'Plus tard' }],
    },
    {
      titre: 'L’action qui détruit',
      sens: 'Le danger en contour dans l’écran, plein dans une confirmation.',
      variantes: [
        { v: 'danger', mot: 'Supprimer' },
        { v: 'danger-plein', mot: 'Effacer' },
      ],
    },
  ];
</script>

<Section
  id="boutons"
  titre="Boutons"
  intro="Six variantes pour quatre sortes d’action, trois tailles, et le bouton réduit à son icône."
>
  {#each ACTIONS as action (action.titre)}
    <Groupe titre={action.titre} sens={action.sens} colonnes={6}>
      {#each action.variantes as { v, mot } (v)}
        <Piece nom="Button" etat="{v} · normal"><Button variant={v}>{mot}</Button></Piece>
        <Piece nom="Button" etat="{v} · survol"><Button variant={v} data-etat="survol">{mot}</Button></Piece>
        <Piece nom="Button" etat="{v} · focus"><Button variant={v} data-etat="focus">{mot}</Button></Piece>
        <Piece nom="Button" etat="{v} · désactivé"><Button variant={v} disabled>{mot}</Button></Piece>
        <Piece nom="Button" etat="{v} · chargement"><Button variant={v} loading>{mot}</Button></Piece>
        <Piece nom="Button" etat="{v} · avec icône"
          ><Button variant={v} icon={icons.Check}>{mot}</Button></Piece
        >
      {/each}
    </Groupe>
  {/each}

  <Groupe titre="Les tailles" sens="28, 34 et 42 px de haut.">
    <Piece nom="Button" etat="petit"><Button variant="secondaire" size="petit">Détails</Button></Piece>
    <Piece nom="Button" etat="normal"><Button variant="secondaire">Détails</Button></Piece>
    <Piece nom="Button" etat="grand"><Button variant="secondaire" size="grand">Détails</Button></Piece>
    <Piece nom="Button" etat="lien"><Button variant="secondaire" href="#boutons">Vers une page</Button></Piece
    >
  </Groupe>

  <Groupe
    titre="L’icône seule"
    colonnes={7}
    sens="Toujours nommée : son libellé paraît en info-bulle, avec son raccourci."
  >
    <Piece nom="IconButton" etat="normal"
      ><IconButton icon={icons.Archive} label="Archiver" shortcut="E" /></Piece
    >
    <Piece nom="IconButton" etat="survol">
      <IconButton icon={icons.Archive} label="Archiver" data-etat="survol" />
    </Piece>
    <Piece nom="IconButton" etat="focus">
      <IconButton icon={icons.Archive} label="Archiver" data-etat="focus" />
    </Piece>
    <Piece nom="IconButton" etat="désactivé"
      ><IconButton icon={icons.Archive} label="Archiver" disabled /></Piece
    >
    <Piece nom="IconButton" etat="petit"
      ><IconButton icon={icons.Trash} label="Supprimer" size="petit" /></Piece
    >
    <Piece nom="IconButton" etat="grand"
      ><IconButton icon={icons.Settings} label="Réglages" size="grand" /></Piece
    >
    <Piece nom="IconButton" etat="secondaire">
      <IconButton icon={icons.Pencil} label="Modifier" variant="secondaire" />
    </Piece>
  </Groupe>

  <Groupe titre="La touche" sens="Le raccourci d’une action, écrit à côté d’elle.">
    <Piece nom="Kbd"><Kbd>Ctrl</Kbd><Kbd>K</Kbd></Piece>
    <Piece nom="Kbd" etat="une touche"><Kbd>E</Kbd></Piece>
  </Groupe>
</Section>
