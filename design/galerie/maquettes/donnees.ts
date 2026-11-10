/*
 * The same four cards and the same permission for every direction, so that only the drawing differs. Invented
 * content, in the neutral voice of a tool; a direction that speaks as the agent rewrites the title (`parole`).
 */
export type Sorte = 'proposition' | 'question' | 'brouillon' | 'suppression';

export interface CarteMaquette {
  id: string;
  sorte: Sorte;
  /** Short label of the kind, as a post gives it. */
  type: string;
  poste: string;
  heure: string;
  titre: string;
  /** The same card, said by the agent. */
  parole: string;
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
}

export const CARTES: CarteMaquette[] = [
  {
    id: 'rangement',
    sorte: 'proposition',
    type: 'Rangement',
    poste: "Lun'Acedia",
    heure: '09:12',
    titre: 'Ranger « Votre facture d’octobre » dans Factures',
    parole: 'Je range « Votre facture d’octobre » dans Factures ?',
    lignes: [
      ['De', 'Opérateur mobile'],
      ['Boîte', 'Factures'],
      ['Étiquette', 'À payer'],
    ],
    raison: 'Même expéditeur que six mails déjà rangés dans Factures.',
    fait: 'Rangé dans Factures',
  },
  {
    id: 'creneau',
    sorte: 'question',
    type: 'Question',
    poste: "Lun'Acedia",
    heure: '09:20',
    titre: 'Quel créneau pour le rendez-vous chez le dentiste ?',
    parole: 'Le dentiste : mardi matin ou jeudi après-midi ?',
    lignes: [['Durée', '45 min']],
    raison: 'Deux créneaux sont libres cette semaine.',
    options: ['Mardi 10:00', 'Jeudi 16:30'],
    fait: 'Rendez-vous posé jeudi à 16:30',
  },
  {
    id: 'reponse',
    sorte: 'brouillon',
    type: 'Brouillon',
    poste: "Lun'Acedia",
    heure: '10:05',
    titre: 'Répondre à Camille : confirmation de jeudi',
    parole: 'J’ai préparé la réponse à Camille. Je la garde en brouillon ?',
    lignes: [],
    apercu:
      'Bonjour Camille, c’est noté pour jeudi à 16 h 30. Je viendrai avec les documents demandés. À jeudi.',
    raison: 'Elle demandait une confirmation avant mercredi.',
    envoie: 'Crée un brouillon : rien n’est envoyé.',
    fait: 'Brouillon créé, non envoyé',
  },
  {
    id: 'corbeille',
    sorte: 'suppression',
    type: 'Suppression',
    poste: "Lun'Acedia",
    heure: '10:40',
    titre: 'Mettre à la corbeille 12 lettres d’information',
    parole: 'Douze lettres d’information jamais ouvertes. Je les jette ?',
    lignes: [
      ['Expéditeurs', '4'],
      ['La plus récente', 'il y a 3 mois'],
    ],
    raison: 'Aucune n’a été ouverte depuis trois mois.',
    fait: '12 mails à la corbeille',
  },
];

/** The permission: an immediate action on the post, which waits for an answer. */
export const PERMISSION = {
  quoi: 'Ouvrir le dossier Téléchargements',
  parole: 'Je peux ouvrir le dossier Téléchargements ?',
  pourquoi: 'Pour retrouver le fichier dont il vient d’être question.',
  cible: 'C:\\Users\\…\\Downloads',
  reponses: ['Une fois', 'Toujours pour ce dossier', 'Refuser'] as const,
};
