<script lang="ts">
  import Segmented from '../../kit/Segmented.svelte';
  import type { Option } from '../../kit/types.ts';
  import './feuille.css';
  import { CARTES, FILE, type EtatCarte, type EtatPermission } from './donnees.ts';
  import Feuille from './Feuille.svelte';
  import File from './File.svelte';
  import Permission from './Permission.svelte';

  /*
   * Mock-ups, not components: the card and the permission as a sheet (the direction CrOliX kept), drawn from a
   * blank sheet with the kit's own pieces, in all their states. Nothing here is in the kit before he validates.
   */
  const MONDES: Option[] = [
    { value: 'neutre', label: 'Neutre' },
    { value: 'anima', label: 'Anima' },
    { value: 'acedia', label: 'Acedia' },
    { value: 'avaritia', label: 'Avaritia' },
    { value: 'luxuria', label: 'Luxuria' },
  ];
  const PARTIES = [
    ['sortes', 'Les quatre sortes'],
    ['etats', 'Les états d’une carte'],
    ['file', 'La file'],
    ['reduites', 'Les formes réduites'],
    ['permission', 'La permission'],
  ] as const;
  const ETATS: [EtatCarte, string, string][] = [
    ['attente', 'En attente', 'Au repos dans la file.'],
    ['occupee', 'Occupée', 'Le geste est parti : il tourne, les autres attendent.'],
    ['modification', 'En modification', 'Les valeurs deviennent des champs, sur place.'],
    ['echec', 'Échec', 'La carte reste, dit ce qui a manqué, et se réessaie.'],
    ['expiree', 'Expirée', 'Elle ne tient plus : elle le dit, et se retire.'],
    ['tranchee', 'Tranchée', 'Une ligne, et de quoi revenir en arrière.'],
    ['refusee', 'Refusée', 'Une ligne aussi.'],
  ];
  const REPONSES: [EtatPermission, string][] = [
    ['attente', 'En attente'],
    ['occupee', 'Occupée'],
    ['une-fois', 'Autorisée une fois'],
    ['toujours', 'Toujours autorisée'],
    ['refusee', 'Refusée'],
    ['sans-reponse', 'Sans réponse'],
  ];
  const rangement = CARTES[0]!;
  const brouillon = CARTES[2]!;

  let { monde = $bindable('anima') }: { monde?: string } = $props();
</script>

{#snippet tete(id: string, idee: string)}
  <header>
    <h2 id="t-{id}">{PARTIES.find(([p]) => p === id)?.[1]}</h2>
    <p class="idee">{idee}</p>
  </header>
{/snippet}

<div class="galerie">
  <header class="tete" data-monde={monde}>
    <div class="titre">
      <p class="retour"><a href="./">La galerie du kit</a></p>
      <h1>Cartes et permission</h1>
      <p>
        Des maquettes, dessinées d’une feuille blanche avec les pièces du kit. La carte est une feuille : elle
        dit tout sans un geste. La file se filtre par type et se pagine. Rien n’est encore dans le kit.
      </p>
    </div>
    <div class="monde">
      <span>Monde</span>
      <Segmented options={MONDES} value={monde} label="Monde" onchange={(v) => (monde = v)} />
    </div>
    <nav aria-label="Parties">
      {#each PARTIES as [id, nom] (id)}<a href="#{id}">{nom}</a>{/each}
    </nav>
  </header>

  <div class="parties" data-monde={monde}>
    <section id="sortes" aria-labelledby="t-sortes">
      {@render tete(
        'sortes',
        'Le filet et le type disent la sorte : proposition et brouillon dans le ton de l’IA, question en attention, suppression en danger.',
      )}
      <div class="grille deux">
        {#each CARTES as c (c.id)}<Feuille carte={c} />{/each}
      </div>
    </section>

    <section id="etats" aria-labelledby="t-etats">
      {@render tete('etats', 'La même carte, de la file à sa fin.')}
      <div class="grille deux">
        {#each ETATS as [etat, nom, sens] (etat)}
          <figure>
            <figcaption><b>{nom}</b>{sens}</figcaption>
            <Feuille carte={rangement} {etat} />
          </figure>
        {/each}
        <figure>
          <figcaption><b>En modification, un brouillon</b>Le texte se reprend avant de valider.</figcaption>
          <Feuille carte={brouillon} etat="modification" />
        </figure>
      </div>
    </section>

    <section id="file" aria-labelledby="t-file">
      {@render tete(
        'file',
        'Cinquante-quatre cartes en attente : les filtres par type et les pages gardent la file courte.',
      )}
      <div class="colonne"><File cartes={FILE} /></div>
    </section>

    <section id="reduites" aria-labelledby="t-reduites">
      {@render tete('reduites', 'Là où la place manque : dans une conversation, un panneau, un téléphone.')}
      <div class="grille deux">
        <figure>
          <figcaption><b>Étroite</b>Même feuille, titre plus petit, sans rappel des touches.</figcaption>
          <div class="etroit"><Feuille carte={rangement} etroite /></div>
        </figure>
        <figure>
          <figcaption><b>Étroite, une question</b>Les réponses tiennent lieu de gestes.</figcaption>
          <div class="etroit"><Feuille carte={CARTES[1]!} etroite /></div>
        </figure>
      </div>
    </section>

    <section id="permission" aria-labelledby="t-permission">
      {@render tete(
        'permission',
        'Une action immédiate sur le poste, qui attend une réponse : la même feuille, plus courte, dans la couleur du monde.',
      )}
      <div class="grille deux">
        {#each REPONSES as [etat, nom] (etat)}
          <figure>
            <figcaption><b>{nom}</b></figcaption>
            <Permission {etat} />
          </figure>
        {/each}
      </div>
    </section>
  </div>
</div>

<style>
  .galerie {
    min-height: 100dvh;
  }
  .tete,
  .parties {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 28px;
  }
  .tete {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 18px 28px;
    padding-top: 30px;
    padding-bottom: 24px;
  }
  .retour {
    margin: 0 0 8px;
    font-size: 12.5px;
  }
  a {
    color: var(--texte-2);
    text-decoration: none;
    border-bottom: 1px solid var(--bordure-forte);
  }
  a:hover,
  a:focus-visible {
    color: var(--texte);
    border-bottom-color: var(--accent-bord);
  }
  h1 {
    margin: 0;
    font: 500 40px/1.05 var(--serif);
  }
  .titre p:last-child {
    margin: 8px 0 0;
    max-width: 68ch;
    font-size: 14px;
    color: var(--texte-2);
  }
  .monde {
    display: grid;
    align-content: start;
    justify-items: end;
    gap: 6px;
    font-size: 12px;
    color: var(--texte-3);
  }
  nav {
    grid-column: 1 / -1;
    display: flex;
    flex-wrap: wrap;
    gap: 6px 22px;
    font-size: 13.5px;
  }
  .parties {
    display: grid;
    gap: 56px;
    padding-bottom: 90px;
  }
  section {
    display: grid;
    gap: 22px;
    padding-top: 28px;
    border-top: 1px solid var(--bordure-forte);
    scroll-margin-top: 16px;
  }
  section > header {
    display: grid;
    gap: 8px;
  }
  h2 {
    margin: 0;
    font: 500 32px/1.1 var(--serif);
  }
  .idee {
    margin: 0;
    max-width: 70ch;
    font-size: 15px;
    color: var(--texte-2);
  }
  .grille {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px 28px;
    align-items: start;
  }
  .colonne {
    max-width: 680px;
  }
  .etroit {
    max-width: 340px;
  }
  figure {
    display: grid;
    gap: 8px;
    margin: 0;
    min-width: 0;
  }
  figcaption {
    font-size: 12.5px;
    color: var(--texte-3);
  }
  figcaption b {
    margin-right: 10px;
    font-weight: 500;
    font-size: 11.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--texte-2);
  }
  @media (max-width: 767.98px) {
    .tete,
    .parties {
      padding-left: 16px;
      padding-right: 16px;
    }
    .tete,
    .grille {
      grid-template-columns: minmax(0, 1fr);
    }
    .monde {
      justify-items: start;
    }
    h1 {
      font-size: 30px;
    }
    h2 {
      font-size: 26px;
    }
  }
</style>
