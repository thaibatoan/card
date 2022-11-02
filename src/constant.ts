export const cards = [
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
  '2',
] as const;
export const cardsMap = {
  '3': 0,
  '4': 1,
  '5': 2,
  '6': 3,
  '7': 4,
  '8': 5,
  '9': 6,
  '10': 7,
  J: 8,
  Q: 9,
  K: 10,
  A: 11,
  '2': 12,
} as const;

export const cardTypes = ['♠️', '♣️', '♦️', '♥️'] as const;
export const cardTypesMap = {
  '♠️': 0,
  '♣️': 1,
  '♦️': 2,
  '♥️': 3,
} as const;

export type CardRank = keyof typeof cardsMap;
export type CardSuit = keyof typeof cardTypesMap;
export type Card = `${CardRank}${CardSuit}`;
