/*
 * The cards the gallery shows: one of each sort, and a long queue to try the load. Invented, in the neutral voice
 * of a tool, in the shape of the contract of the posts: lines of text, a reason, answers for a question.
 */
export interface CarteDemo {
  id: string;
  tone: 'ia' | 'attention' | 'danger';
  /** Short label of the kind; the queue filters on it. */
  kind: string;
  meta: string[];
  title: string;
  lines: string[];
  reason: string;
  options?: string[];
  /** Accepting creates something outside: said before the gesture. */
  note?: string;
  acceptLabel?: string;
  doneText: string;
}

const POSTE = "Lun'Acedia";

export const CARTES: CarteDemo[] = [
  {
    id: 'rangement',
    tone: 'ia',
    kind: 'Rangement',
    meta: [POSTE, '09:12'],
    title: 'Ranger « Votre facture d’octobre » dans Factures',
    lines: ['De : Opérateur mobile', 'Boîte : Factures', 'Étiquette : À payer'],
    reason: 'Même expéditeur que six mails déjà rangés dans Factures.',
    doneText: 'Rangé dans Factures',
  },
  {
    id: 'creneau',
    tone: 'attention',
    kind: 'Question',
    meta: [POSTE, '09:20'],
    title: 'Quel créneau pour le rendez-vous chez le dentiste ?',
    lines: ['Durée : 45 min'],
    reason: 'Deux créneaux sont libres cette semaine.',
    options: ['Mardi 10:00', 'Jeudi 16:30'],
    doneText: 'Rendez-vous posé jeudi à 16:30',
  },
  {
    id: 'reponse',
    tone: 'ia',
    kind: 'Brouillon',
    meta: [POSTE, '10:05'],
    title: 'Répondre à Camille : confirmation de jeudi',
    lines: ['« Bonjour Camille, c’est noté pour jeudi à 16 h 30. Je viendrai avec les documents demandés. »'],
    reason: 'Elle demandait une confirmation avant mercredi.',
    note: 'Crée un brouillon : rien n’est envoyé.',
    acceptLabel: 'Créer le brouillon',
    doneText: 'Brouillon créé, non envoyé',
  },
  {
    id: 'corbeille',
    tone: 'danger',
    kind: 'Suppression',
    meta: [POSTE, '10:40'],
    title: 'Mettre à la corbeille 12 lettres d’information',
    lines: ['4 expéditeurs', 'La plus récente : il y a 3 mois'],
    reason: 'Aucune n’a été ouverte depuis trois mois.',
    doneText: '12 mails à la corbeille',
  },
];

const OBJETS = ['Votre facture', 'Relevé de compte', 'Confirmation de commande', 'Avis d’échéance', 'Reçu'];
const BOITES = ['Factures', 'Banque', 'Achats', 'Assurance'];
const PRENOMS = ['Camille', 'Sacha', 'Noa', 'Alix', 'Lou'];
const RENDEZ_VOUS = ['le dentiste', 'le garage', 'la banque', 'le médecin'];
/** Six tidyings, one question, two drafts and one deletion in ten: what a mail post really proposes. */
const ORDRE = [0, 0, 2, 0, 1, 0, 3, 0, 2, 0];

/** A long queue, to try the filters and the pages: 54 cards drawn from the four above. */
export const FILE: CarteDemo[] = Array.from({ length: 54 }, (_, i) => {
  const modele = CARTES[ORDRE[i % ORDRE.length]!]!;
  const minutes = 8 * 60 + i * 4;
  const heure = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  const carte = { ...modele, id: `${modele.id}-${i}`, meta: [POSTE, heure] };
  const boite = BOITES[i % BOITES.length]!;
  const prenom = PRENOMS[i % PRENOMS.length]!;
  if (modele.kind === 'Rangement')
    return {
      ...carte,
      title: `Ranger « ${OBJETS[i % OBJETS.length]} » dans ${boite}`,
      lines: [`Boîte : ${boite}`],
      reason: `Même expéditeur que d’autres mails déjà rangés dans ${boite}.`,
    };
  if (modele.kind === 'Question')
    return { ...carte, title: `Quel créneau pour ${RENDEZ_VOUS[i % RENDEZ_VOUS.length]} ?` };
  if (modele.kind === 'Brouillon')
    return {
      ...carte,
      title: `Répondre à ${prenom} : confirmation`,
      lines: [`« Bonjour ${prenom}, c’est noté. À bientôt. »`],
      reason: 'Une confirmation était demandée.',
    };
  return { ...carte, title: `Mettre à la corbeille ${6 + (i % 9)} lettres d’information` };
});
