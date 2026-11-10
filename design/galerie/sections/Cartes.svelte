<script lang="ts">
  import Button from '../../kit/Button.svelte';
  import Chip from '../../kit/Chip.svelte';
  import DecisionCard from '../../kit/DecisionCard.svelte';
  import PermissionCard from '../../kit/PermissionCard.svelte';
  import { ChevronLeft, ChevronRight } from '../../kit/Icon.ts';
  import { CARTES, FILE, type CarteDemo } from '../cartes.ts';
  import Groupe from '../Groupe.svelte';
  import Piece from '../Piece.svelte';
  import Section from '../Section.svelte';

  /*
   * The card of the kit, drawn as a sheet, then what each project still draws on its own. The queue under load is an
   * assembly, not a component: chips of the kit to filter by kind, two buttons to turn the pages.
   */
  const rien = () => {};
  const rangement = CARTES[0]!;
  const PERMISSION = {
    what: 'Ouvrir le dossier Téléchargements',
    target: 'C:\\Users\\…\\Downloads',
    reason: 'Pour retrouver le fichier dont il vient d’être question.',
    meta: ["Lun'Luxuria", 'maintenant'],
    scope: 'pour ce dossier',
    onanswer: rien,
    onrevoke: rien,
  };
  const REPONSES = [
    ['pending', 'en attente', {}],
    ['pending', 'occupée', { busy: true }],
    ['once', 'autorisée une fois', {}],
    ['always', 'toujours autorisée', {}],
    ['refused', 'refusée', {}],
    ['unanswered', 'sans réponse', {}],
  ] as const;
  const PAR_PAGE = 5;

  let gardes = $state<string[]>([]);
  let page = $state(1);
  const sortes = [...new Set(FILE.map((c) => c.kind))].map((nom) => ({
    nom,
    nombre: FILE.filter((c) => c.kind === nom).length,
  }));
  const visibles = $derived(gardes.length ? FILE.filter((c) => gardes.includes(c.kind)) : FILE);
  const pages = $derived(Math.max(1, Math.ceil(visibles.length / PAR_PAGE)));
  const tranche = $derived(visibles.slice((page - 1) * PAR_PAGE, page * PAR_PAGE));

  function garder(sorte?: string) {
    gardes = !sorte ? [] : gardes.includes(sorte) ? gardes.filter((s) => s !== sorte) : [...gardes, sorte];
    page = 1;
  }
</script>

{#snippet carte(c: CarteDemo, plus: Record<string, unknown> = {})}
  <DecisionCard
    tone={c.tone}
    kind={c.kind}
    meta={c.meta}
    title={c.title}
    lines={c.lines}
    reason={c.reason}
    note={c.note}
    options={c.options}
    acceptLabel={c.acceptLabel}
    doneText={c.doneText}
    shortcuts={c.options ? [] : ['V', 'R']}
    onaccept={rien}
    onrefuse={c.options ? undefined : rien}
    onedit={c.options ? undefined : rien}
    onlater={c.options ? rien : undefined}
    {...plus}
  />
{/snippet}

<Section
  id="cartes"
  titre="Cartes"
  intro="La carte, au sens du dictionnaire : une proposition de traitement préparée par un agent, qui attend d’être tranchée. Elle est une feuille : elle dit tout sans un geste. Le kit en tient le dessin ; le corps, les gestes en plus et les touches restent à chaque projet. La permission, elle, valide une action immédiate : elle reprend la feuille, sans file."
>
  <Groupe
    titre="Les sortes"
    sens="Le filet et le type disent la sorte : proposition, question, suppression."
    colonnes={2}
  >
    {#each CARTES as c (c.id)}
      <Piece nom="DecisionCard" etat={c.kind.toLowerCase()}>{@render carte(c)}</Piece>
    {/each}
  </Groupe>

  <Groupe titre="En attente" sens="Ce qui peut arriver à une carte avant d’être tranchée." colonnes={2}>
    <Piece nom="DecisionCard" etat="occupée">{@render carte(rangement, { busy: true })}</Piece>
    <Piece nom="DecisionCard" etat="geste raté">
      {@render carte(rangement, { error: 'le poste ne répond pas.', onretry: rien })}
    </Piece>
    <Piece nom="DecisionCard" etat="lecture seule">
      {@render carte(rangement, { off: 'Indisponible tant que le poste ne répond pas.' })}
    </Piece>
    <Piece nom="DecisionCard" etat="étroite">
      <div class="etroit">{@render carte(rangement, { narrow: true })}</div>
    </Piece>
  </Groupe>

  <Groupe titre="Tranchée" sens="Un statut final replie la feuille en une ligne." colonnes={2}>
    <Piece nom="DecisionCard" etat="faite">{@render carte(rangement, { status: 'done', onundo: rien })}</Piece
    >
    <Piece nom="DecisionCard" etat="refusée">
      {@render carte(rangement, { status: 'refused', onundo: rien })}
    </Piece>
    <Piece nom="DecisionCard" etat="échec">
      {@render carte(rangement, {
        status: 'failed',
        error: 'La boîte Factures est introuvable.',
        ondismiss: rien,
      })}
    </Piece>
    <Piece nom="DecisionCard" etat="expirée">
      {@render carte(rangement, { status: 'expired', ondismiss: rien })}
    </Piece>
  </Groupe>

  <Groupe
    titre="La permission"
    sens="Une action immédiate sur le poste, qui attend une réponse : la même feuille, plus courte, dans la couleur du monde."
    colonnes={2}
  >
    {#each REPONSES as [status, etat, plus] (etat)}
      <Piece nom="PermissionCard" {etat}><PermissionCard {...PERMISSION} {status} {...plus} /></Piece>
    {/each}
  </Groupe>

  <Groupe
    titre="La file sous la charge"
    sens="Un assemblage, pas un composant : des filtres par type et des pages gardent 54 cartes courtes."
    colonne
  >
    <Piece nom="DecisionCard" etat="dans une file filtrée et paginée" large>
      <div class="file">
        <div class="filtres" role="group" aria-label="Filtrer par type">
          <Chip on={!gardes.length} count={FILE.length} onclick={() => garder()}>Tout</Chip>
          {#each sortes as s (s.nom)}
            <Chip on={gardes.includes(s.nom)} count={s.nombre} onclick={() => garder(s.nom)}>{s.nom}</Chip>
          {/each}
        </div>
        {#each tranche as c (c.id)}{@render carte(c)}{/each}
        <nav class="pages" aria-label="Pages de la file">
          <Button
            variant="fantome"
            size="petit"
            icon={ChevronLeft}
            disabled={page === 1}
            onclick={() => (page -= 1)}>Précédentes</Button
          >
          <p aria-live="polite">Page {page} sur {pages}<span>{visibles.length} en attente</span></p>
          <Button
            variant="fantome"
            size="petit"
            icon={ChevronRight}
            disabled={page === pages}
            onclick={() => (page += 1)}>Suivantes</Button
          >
        </nav>
      </div>
    </Piece>
  </Groupe>
</Section>

<style>
  .etroit {
    max-width: 340px;
  }
  .file {
    display: grid;
    gap: 14px;
    max-width: 680px;
  }
  .filtres {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .pages {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 10px;
    border-top: 1px solid var(--bordure);
  }
  .pages p {
    display: grid;
    justify-items: center;
    margin: 0;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
  }
  .pages span {
    font-size: 12px;
    color: var(--texte-3);
  }
</style>
