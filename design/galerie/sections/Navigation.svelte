<script lang="ts">
  import BottomNav from '../../kit/BottomNav.svelte';
  import Button from '../../kit/Button.svelte';
  import * as icons from '../../kit/Icon.ts';
  import IconButton from '../../kit/IconButton.svelte';
  import NavGroup from '../../kit/NavGroup.svelte';
  import NavLink from '../../kit/NavLink.svelte';
  import Rail from '../../kit/Rail.svelte';
  import ServiceCard from '../../kit/ServiceCard.svelte';
  import type { NavItem } from '../../kit/types.ts';
  import Groupe from '../Groupe.svelte';
  import Piece from '../Piece.svelte';
  import Section from '../Section.svelte';

  const BAS: NavItem[] = [
    { href: '#bureau', label: 'Bureau', icon: icons.LayoutDashboard },
    { href: '#trancher', label: 'À trancher', icon: icons.Check, count: 3, countTone: 'ia' },
    { href: '#journal', label: 'Journal', icon: icons.BookOpen },
    { href: '#atelier', label: 'Atelier', icon: icons.Settings },
  ];
</script>

<Section
  id="navigation"
  titre="Navigation"
  intro="Aller d’un écran à l’autre : le rail au bureau, la barre du bas au téléphone, et leurs liens."
>
  <Groupe
    titre="Un lien de navigation"
    colonnes={3}
    sens="Courant, survolé, au clavier, avec son compte ; « ia » compte ce qui attend une validation."
  >
    <Piece nom="NavLink" etat="courant"
      ><NavLink href="#navigation" label="Réception" icon={icons.Inbox} count={12} current /></Piece
    >
    <Piece nom="NavLink" etat="normal"
      ><NavLink href="#navigation" label="Agenda" icon={icons.Calendar} /></Piece
    >
    <Piece nom="NavLink" etat="survol"
      ><NavLink href="#navigation" label="Tâches" icon={icons.List} data-etat="survol" /></Piece
    >
    <Piece nom="NavLink" etat="focus"
      ><NavLink href="#navigation" label="Journal" icon={icons.Clock} data-etat="focus" /></Piece
    >
    <Piece nom="NavLink" etat="compte ia">
      <NavLink href="#navigation" label="À valider" icon={icons.Sparkles} count={3} countTone="ia" />
    </Piece>
    <Piece nom="NavLink" etat="couleur à la place de l’icône">
      <NavLink href="#navigation" label="Factures" color="var(--attention)" count={2} />
    </Piece>
  </Groupe>

  <Groupe
    titre="Le rail"
    sens="La navigation du bureau : un en-tête, des liens, des groupes, un pied."
    colonnes={2}
  >
    <Piece nom="Rail" etat="principal, avec NavGroup">
      <div class="cadre">
        <Rail label="Navigation de la galerie">
          {#snippet header()}<Button variant="principal" icon={icons.Plus}>Nouveau</Button>{/snippet}
          <NavLink href="#navigation" label="Réception" icon={icons.Inbox} count={12} current />
          <NavLink href="#navigation" label="À valider" icon={icons.Sparkles} count={3} countTone="ia" />
          <NavGroup title="Boîtes">
            {#snippet action()}<IconButton icon={icons.Plus} label="Nouvelle boîte" size="petit" />{/snippet}
            <NavLink href="#navigation" label="Factures" color="var(--attention)" count={2} />
            <NavLink href="#navigation" label="Administratif" color="var(--info)" />
          </NavGroup>
          {#snippet footer()}<ServiceCard state="actif" detail="Synchronisé il y a 1 min" />{/snippet}
        </Rail>
      </div>
    </Piece>
    <Piece nom="Rail" etat="thèmes">
      <div class="cadre">
        <Rail label="Thèmes des réglages" variant="themes" title="Réglages">
          <NavGroup title="Identité">
            <NavLink href="#navigation" label="L’agent" icon={icons.Sparkles} current />
            <NavLink href="#navigation" label="Appareils" icon={icons.Smartphone} />
          </NavGroup>
          <NavGroup title="La conversation">
            <NavLink href="#navigation" label="Notifications" icon={icons.Bell} />
          </NavGroup>
        </Rail>
      </div>
    </Piece>
  </Groupe>

  <Groupe titre="La barre du bas" sens="La navigation du téléphone, quatre destinations au plus." colonne>
    <Piece nom="BottomNav" etat="au téléphone" large>
      <div class="tel"><BottomNav items={BAS} current="#bureau" label="Navigation du téléphone" /></div>
    </Piece>
  </Groupe>
</Section>

<style>
  /* A rail fills the height it is given: a frame gives it one, as an app's shell does. */
  .cadre {
    display: flex;
    width: 260px;
    max-width: 100%;
    height: 380px;
    border: 1px solid var(--bordure);
    border-radius: var(--r-2);
    overflow: hidden;
  }
  /* The bottom bar is fixed to the screen in an app: here it stays in its frame. */
  .tel {
    position: relative;
    width: 390px;
    max-width: 100%;
    height: 72px;
    border: 1px solid var(--bordure);
    border-radius: var(--r-2);
    overflow: hidden;
    transform: translateZ(0);
  }
</style>
