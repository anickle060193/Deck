export const enum Suit
{
  Spades = 'Spades',
  Hearts = 'Hearts',
  Clubs = 'Clubs',
  Diamonds = 'Diamonds'
}

export const SUITS = [
  Suit.Spades,
  Suit.Hearts,
  Suit.Clubs,
  Suit.Diamonds
];

export const enum Rank
{
  Ace = 'Ace',
  Two = 'Two',
  Three = 'Three',
  Four = 'Four',
  Five = 'Five',
  Six = 'Six',
  Seven = 'Seven',
  Eight = 'Eight',
  Nine = 'Nine',
  Ten = 'Ten',
  Jack = 'Jack',
  Queen = 'Queen',
  King = 'King'
}

export const RANKS = [
  Rank.Ace,
  Rank.Two,
  Rank.Three,
  Rank.Four,
  Rank.Five,
  Rank.Six,
  Rank.Seven,
  Rank.Eight,
  Rank.Nine,
  Rank.Ten,
  Rank.Jack,
  Rank.Queen,
  Rank.King
];

export interface Card
{
  id: string;
  suit: Suit;
  rank: Rank;
  index: number;
  x: number;
  y: number;
}

export type CardMap = { [ id: string ]: Card };
