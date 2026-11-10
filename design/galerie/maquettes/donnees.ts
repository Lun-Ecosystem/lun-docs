/*
 * The content of the mock-ups: four cards, one of each sort, a permission, and a long queue to try the load.
 * Invented, in the neutral voice of a tool.
 */
export type Sorte = 'proposition' | 'question' | 'brouillon' | 'suppression';

/** What a card goes through, from the queue to its end. */
export type EtatCarte = 'attente' | 'occupee' | 'modification' | 'tranchee' | 'refusee' | 'echec' | 'expiree';

/** A permission is answered at once, or not at all. */
export type EtatPermission = 'attente' | 'occupee' | 'une-fois' | 'toujours' | 'refusee' | 'sans-reponse';

export interface CarteMaquette {
  id: string;
  sorte: Sorte;
  /** Short label of the kind, as a post gives it; the queue filters on it. */
  type: string;
  poste: string;
  heure: string;
  titre: string;
  /** Target and new values, written for a person. */
  lignes: [string, string][];
  /** The preview of a draft, in place of the lines. */
  apercu?: string;
  raison: string;
  /** The answers of a question. */
  options?: string[];
  /** Validating creates something outside: said before the gesture. */
  envoie?: string;
  /** What the line says once decided. */
  fait: string;
  /** Why validating did not go through. */
  echec: string;
  /** Why the card no longer stands. */
  expire: string;
}

export const CARTES: CarteMaquette[] = [
  {
    id: 'rangement',
    sorte: 'proposition',
    type: 'Rangement',
    poste: "Lun'Acedia",
    heure: '09:12',
    titre: 'Ranger « Votre facture d’octobre » dans Factures',
    lignes: [
      ['De', 'Opérateur mobile'],
      ['Boîte', 'Factures'],
      ['Étiquette', 'À payer'],
    ],
    raison: 'Même expéditeur que six mails déjà rangés dans Factures.',
    fait: 'Rangé dans Factures',
    echec: 'la boîte Factures est introuvable.',
    expire: 'le mail a déjà été rangé à la main.',
  },
  {
    id: 'creneau',
    sorte: 'question',
    type: 'Question',
    poste: "Lun'Acedia",
    heure: '09:20',
    titre: 'Quel créneau pour le rendez-vous chez le dentiste ?',
    lignes: [['Durée', '45 min']],
    raison: 'Deux créneaux sont libres cette semaine.',
    options: ['Mardi 10:00', 'Jeudi 16:30'],
    fait: 'Rendez-vous posé jeudi à 16:30',
    echec: 'l’agenda ne répond pas.',
    expire: 'les deux créneaux sont passés.',
  },
  {
    id: 'reponse',
    sorte: 'brouillon',
    type: 'Brouillon',
    poste: "Lun'Acedia",
    heure: '10:05',
    titre: 'Répondre à Camille : confirmation de jeudi',
    lignes: [],
    apercu:
      'Bonjour Camille, c’est noté pour jeudi à 16 h 30. Je viendrai avec les documents demandés. À jeudi.',
    raison: 'Elle demandait une confirmation avant mercredi.',
    envoie: 'Crée un brouillon : rien n’est envoyé.',
    fait: 'Brouillon créé, non envoyé',
    echec: 'la messagerie ne répond pas.',
    expire: 'une réponse est déjà partie.',
  },
  {
    id: 'corbeille',
    sorte: 'suppression',
    type: 'Suppression',
    poste: "Lun'Acedia",
    heure: '10:40',
    titre: 'Mettre à la corbeille 12 lettres d’information',
    lignes: [
      ['Expéditeurs', '4'],
      ['La plus récente', 'il y a 3 mois'],
    ],
    raison: 'Aucune n’a été ouverte depuis trois mois.',
    fait: '12 mails à la corbeille',
    echec: 'la messagerie ne répond pas.',
    expire: 'ces mails ont déjà été supprimés.',
  },
];

/** The permission: an immediate action on the post, which waits for an answer. */
export const PERMISSION = {
  quoi: 'Ouvrir le dossier Téléchargements',
  poste: "Lun'Luxuria",
  pourquoi: 'Pour retrouver le fichier dont il vient d’être question.',
  cible: 'C:\\Users\\…\\Downloads',
  reponses: ['Une fois', 'Toujours pour ce dossier', 'Refuser'] as const,
};

const OBJETS = ['Votre facture', 'Relevé de compte', 'Confirmation de commande', 'Avis d’échéance', 'Reçu'];
const BOITES = ['Factures', 'Banque', 'Achats', 'Assurance'];
const PRENOMS = ['Camille', 'Sacha', 'Noa', 'Alix', 'Lou'];
const RENDEZ_VOUS = ['le dentiste', 'le garage', 'la banque', 'le médecin'];
/** Six tidyings, one question, two drafts and one deletion in ten: what a mail post really proposes. */
const ORDRE = [0, 0, 2, 0, 1, 0, 3, 0, 2, 0];

/** A long queue, to try the filters and the pages: 54 cards drawn from the four above. */
export const FILE: CarteMaquette[] = Array.from({ length: 54 }, (_, i) => {
  const modele = CARTES[ORDRE[i % ORDRE.length]!]!;
  const minutes = 8 * 60 + i * 4;
  const heure = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  const carte = { ...modele, id: `${modele.id}-${i}`, heure };
  const boite = BOITES[i % BOITES.length]!;
  const prenom = PRENOMS[i % PRENOMS.length]!;
  if (modele.sorte === 'proposition')
    return {
      ...carte,
      titre: `Ranger « ${OBJETS[i % OBJETS.length]} » dans ${boite}`,
      lignes: [['Boîte', boite]],
      raison: `Même expéditeur que d’autres mails déjà rangés dans ${boite}.`,
    };
  if (modele.sorte === 'question')
    return { ...carte, titre: `Quel créneau pour ${RENDEZ_VOUS[i % RENDEZ_VOUS.length]} ?` };
  if (modele.sorte === 'brouillon')
    return {
      ...carte,
      titre: `Répondre à ${prenom} : confirmation`,
      apercu: `Bonjour ${prenom}, c’est noté. À bientôt.`,
      raison: 'Une confirmation était demandée.',
    };
  return { ...carte, titre: `Mettre à la corbeille ${6 + (i % 9)} lettres d’information` };
});
