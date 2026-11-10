<script lang="ts">
  import Segmented from '../../kit/Segmented.svelte';
  import type { Option } from '../../kit/types.ts';
  import PisteFeuille from './PisteFeuille.svelte';
  import PisteMot from './PisteMot.svelte';
  import PisteRangee from './PisteRangee.svelte';

  /*
   * Mock-ups, not components: three directions for the card and the permission, drawn from a blank sheet with the
   * kit's own pieces, on the same content. Nothing here is in the kit; what CrOliX keeps is drawn again in all its
   * states, then enters it.
   */
  const MONDES: Option[] = [
    { value: 'neutre', label: 'Neutre' },
    { value: 'anima', label: 'Anima' },
    { value: 'acedia', label: 'Acedia' },
    { value: 'avaritia', label: 'Avaritia' },
    { value: 'luxuria', label: 'Luxuria' },
  ];
  const PISTES = [
    {
      id: 'feuille',
      lettre: 'A',
      nom: 'La feuille',
      idee: 'Chaque carte dit tout, sans un geste : le type, les valeurs, la raison, puis les gestes.',
      pour: 'Se lit d’un coup d’œil. La raison a sa place à elle. Le geste principal pèse.',
      contre:
        'Prend de la place : quatre cartes remplissent l’écran. Longue à parcourir quand la file grossit.',
    },
    {
      id: 'rangee',
      lettre: 'B',
      nom: 'La rangée',
      idee: 'La file est une liste. Une ligne par carte, le geste principal sur la ligne ; la carte se déplie sur place.',
      pour: 'Trancher vite et beaucoup. Dix cartes tiennent à l’écran. Proche de la file actuelle du core.',
      contre: 'Dit moins au repos : valider sans déplier, c’est valider sans avoir lu la raison.',
    },
    {
      id: 'mot',
      lettre: 'C',
      nom: 'Le mot',
      idee: 'La carte est une chose que l’agent dit : son sceau, une phrase dans sa voix, des réponses en mots.',
      pour: 'Fait exister une présence. Tient dans la conversation et sur le corps. La permission a la même forme.',
      contre: 'Plus lente dans une longue file. Demande une phrase écrite pour chaque sorte de carte.',
    },
  ] as const;

  let { monde = $bindable('anima') }: { monde?: string } = $props();
</script>

<div class="galerie">
  <header class="tete" data-monde={monde}>
    <div class="titre">
      <p class="retour"><a href="./">La galerie du kit</a></p>
      <h1>Cartes et permission : trois pistes</h1>
      <p>
        Des maquettes, dessinées d’une feuille blanche avec les pièces du kit, sur le même contenu : une
        proposition, une question, un brouillon, une suppression ; la carte tranchée, la forme compacte ; la
        permission. Rien n’est encore dans le kit.
      </p>
    </div>
    <div class="monde">
      <span>Monde</span>
      <Segmented options={MONDES} value={monde} label="Monde" onchange={(v) => (monde = v)} />
    </div>
    <nav aria-label="Pistes">
      {#each PISTES as p (p.id)}<a href="#{p.id}">{p.lettre}. {p.nom}</a>{/each}
    </nav>
  </header>

  <div class="pistes" data-monde={monde}>
    {#each PISTES as p (p.id)}
      <section id={p.id} aria-labelledby="t-{p.id}">
        <header>
          <h2 id="t-{p.id}"><span class="lettre">{p.lettre}</span>{p.nom}</h2>
          <p class="idee">{p.idee}</p>
          <dl>
            <div>
              <dt>Pour</dt>
              <dd>{p.pour}</dd>
            </div>
            <div>
              <dt>Contre</dt>
              <dd>{p.contre}</dd>
            </div>
          </dl>
        </header>
        {#if p.id === 'feuille'}<PisteFeuille />{:else if p.id === 'rangee'}<PisteRangee />{:else}<PisteMot
          />{/if}
      </section>
    {/each}
  </div>
</div>

<style>
  .galerie {
    min-height: 100dvh;
  }
  .tete,
  .pistes {
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
  .pistes {
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
    gap: 10px;
  }
  h2 {
    display: flex;
    align-items: baseline;
    gap: 14px;
    margin: 0;
    font: 500 32px/1.1 var(--serif);
  }
  .lettre {
    font: 500 13px/1 var(--sans);
    letter-spacing: 0.1em;
    color: var(--accent-texte);
  }
  .idee {
    margin: 0;
    max-width: 70ch;
    font-size: 15px;
  }
  dl {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 8px 28px;
    margin: 0;
    font-size: 13px;
  }
  dt {
    font-size: 11.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--texte-3);
  }
  dd {
    margin: 2px 0 0;
    color: var(--texte-2);
  }
  @media (max-width: 767.98px) {
    .tete,
    .pistes {
      padding-left: 16px;
      padding-right: 16px;
    }
    .tete {
      grid-template-columns: 1fr;
    }
    .monde {
      justify-items: start;
    }
    h1 {
      font-size: 30px;
    }
  }
</style>
