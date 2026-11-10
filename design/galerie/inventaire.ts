/*
 * Every reusable interface element of the ecosystem, with where it stands. Written by hand, read on 2026-11-10 from
 * the four apps at `main`: a script reading them would make lun-docs depend on the apps.
 */
export type Statut = 'commun' | 'variante' | 'propre';
export type Famille =
  'boutons' | 'champs' | 'bascules' | 'calques' | 'listes' | 'tuiles' | 'navigation' | 'cartes';

export interface Element {
  nom: string;
  famille: Famille;
  statut: Statut;
  /** Which projects have it. */
  projets: string[];
  /** For a common element: the projects whose copy of the kit does not have it yet. */
  absentDe?: string[];
  /** Where it lives, for a variant or an own element. */
  fichier?: string;
  /** What differs, or what it is for. */
  note?: string;
}

const ANIMA = "Lun'Anima";
const ACEDIA = "Lun'Acedia";
const AVARITIA = "Lun'Avaritia";
const LUXURIA = "Lun'Luxuria";
const TOUS = [ANIMA, ACEDIA, AVARITIA, LUXURIA];
const KIT_ACEDIA = 'views/src/lib/ui';
const KIT_AVARITIA = 'app/src/lib/ui';
/** In the kit, but not in the own kit of these projects. */
const ABSENT: Record<string, string[]> = {
  DropZone: [ACEDIA],
  StatCard: [ACEDIA],
  TextArea: [ACEDIA],
  DecisionCard: [ACEDIA, AVARITIA],
  PermissionCard: [ACEDIA, AVARITIA],
};

const commun = (famille: Famille, ...noms: string[]): Element[] =>
  noms.map((nom) =>
    ABSENT[nom]
      ? {
          nom,
          famille,
          statut: 'commun',
          projets: TOUS.filter((p) => !ABSENT[nom]!.includes(p)),
          absentDe: ABSENT[nom],
        }
      : { nom, famille, statut: 'commun', projets: TOUS },
  );
const variante = (famille: Famille, projet: string, dossier: string, ...noms: string[]): Element[] =>
  noms.map((nom) => ({
    nom,
    famille,
    statut: 'variante',
    projets: [projet],
    fichier: `${dossier}/${nom}.svelte`,
    note: 'Sa propre version d’un composant du kit.',
  }));
const propre = (famille: Famille, projet: string, fichier: string, nom: string, note: string): Element => ({
  nom,
  famille,
  statut: 'propre',
  projets: [projet],
  fichier,
  note,
});

export const INVENTAIRE: Element[] = [
  ...commun('boutons', 'Button', 'IconButton', 'Kbd'),
  ...variante('boutons', ACEDIA, KIT_ACEDIA, 'Button'),
  propre(
    'boutons',
    ACEDIA,
    `${KIT_ACEDIA}/Fab.svelte`,
    'Fab',
    'Le bouton flottant « Nouveau », au téléphone.',
  ),

  ...commun(
    'champs',
    'Field',
    'TextInput',
    'TextArea',
    'Select',
    'Slider',
    'Segmented',
    'CodeInput',
    'DropZone',
  ),
  ...variante('champs', ACEDIA, KIT_ACEDIA, 'Segmented'),
  propre('champs', ACEDIA, `${KIT_ACEDIA}/Tabs.svelte`, 'Tabs', 'Des onglets au-dessus d’un contenu.'),

  ...commun('bascules', 'Switch', 'Checkbox', 'Badge', 'Chip'),
  ...variante('bascules', ACEDIA, KIT_ACEDIA, 'Badge'),
  propre(
    'bascules',
    ACEDIA,
    `${KIT_ACEDIA}/AutoMark.svelte`,
    'AutoMark',
    'La marque de ce que l’agent a fait seul.',
  ),

  ...commun('calques', 'Tooltip', 'Dialog', 'ConfirmDialog', 'CommandPalette', 'Toaster', 'Banner'),
  ...variante('calques', ACEDIA, KIT_ACEDIA, 'Dialog', 'ConfirmDialog'),
  ...variante('calques', AVARITIA, KIT_AVARITIA, 'Dialog', 'ConfirmDialog'),
  propre('calques', ACEDIA, `${KIT_ACEDIA}/Menu.svelte`, 'Menu', 'Un menu ancré à son bouton.'),
  propre('calques', ACEDIA, `${KIT_ACEDIA}/Popover.svelte`, 'Popover', 'Une bulle ancrée, avec du contenu.'),

  ...commun('listes', 'ListRow', 'SettingsCard', 'SettingsRow', 'EmptyState', 'Skeleton', 'Steps'),
  ...variante('listes', ACEDIA, KIT_ACEDIA, 'SettingsRow', 'EmptyState'),
  propre('listes', ACEDIA, `${KIT_ACEDIA}/DayGroup.svelte`, 'DayGroup', 'Un groupe de lignes sous un jour.'),

  ...commun('tuiles', 'StatCard', 'ServiceCard', 'StandaloneCard'),
  ...variante('tuiles', ACEDIA, KIT_ACEDIA, 'ServiceCard', 'StandaloneCard'),
  ...variante('tuiles', AVARITIA, KIT_AVARITIA, 'StandaloneCard'),

  ...commun('navigation', 'Rail', 'NavGroup', 'NavLink', 'BottomNav'),
  ...variante('navigation', ACEDIA, KIT_ACEDIA, 'Rail'),

  // The card of the dictionary (a proposal that waits): the kit has its sheet; each project still draws its own.
  ...commun('cartes', 'DecisionCard', 'PermissionCard'),
  propre(
    'cartes',
    ACEDIA,
    `${KIT_ACEDIA}/ProposalCard.svelte`,
    'ProposalCard',
    'La proposition complète, dans la lecture.',
  ),
  propre(
    'cartes',
    ACEDIA,
    `${KIT_ACEDIA}/ProposalChip.svelte`,
    'ProposalChip',
    'La proposition compacte, dans la liste.',
  ),
  propre(
    'cartes',
    ACEDIA,
    'views/src/lib/pina/ActionCard.svelte',
    'ActionCard',
    'La carte d’une action de l’agent.',
  ),
  propre(
    'cartes',
    ACEDIA,
    'views/src/lib/pina/DraftCard.svelte',
    'DraftCard',
    'La carte d’un brouillon de réponse.',
  ),
  propre(
    'cartes',
    ANIMA,
    'ui/src/file/File.svelte',
    'File',
    'La file « À trancher », avec Pile, Lot, Rangee, Depliee.',
  ),
  propre(
    'cartes',
    ANIMA,
    'ui/src/natsume/CarteReduite.svelte',
    'CarteReduite',
    'La carte dans la conversation.',
  ),
  propre(
    'cartes',
    AVARITIA,
    'app/src/valider/DraftItem.svelte',
    'DraftItem',
    'Un brouillon de fiche à valider.',
  ),
  propre(
    'cartes',
    AVARITIA,
    'app/src/valider/FicheDraftEditor.svelte',
    'FicheDraftEditor',
    'L’éditeur du brouillon.',
  ),
];

export const LEGENDE: Record<Statut, { mot: string; sens: string }> = {
  commun: { mot: 'Commun', sens: 'Dans le kit : le même dans chaque projet qui l’a.' },
  variante: { mot: 'Variante', sens: 'Un projet garde sa propre version d’un composant du kit.' },
  propre: { mot: 'Propre', sens: 'N’existe que dans un projet.' },
};

/** What a family has outside the plain common case: variants, own elements, and common ones a project lacks. */
export const ailleurs = (famille: Famille): Element[] =>
  INVENTAIRE.filter((e) => e.famille === famille && (e.statut !== 'commun' || e.absentDe));
