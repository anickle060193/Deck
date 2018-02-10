type Diff<T extends string, U extends string> = ( {[ P in T ]: P } & {[ P in U ]: never } & { [ x: string ]: never } )[ T ];
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

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

type CardIndex = Date | null | number;

export interface CardBase
{
  suit: Suit;
  rank: Rank;
  index: CardIndex;
  x: number;
  y: number;
  faceDown: boolean;
}

export interface Card extends CardBase
{
  id: string;
}

export interface CardUpdate extends Partial<Omit<CardBase, 'index'>>
{
  id: string;
  index?: CardIndex | firebase.firestore.FieldValue;
}

export type CardMap = { [ id: string ]: Card };

export function cardSorter( cardA: Card, cardB: Card )
{
  return ( +( cardB.index || new Date() ) ) - ( +( cardA.index || new Date() ) );
}

export function toCardMap( cards: Card[] )
{
  let cardMap: CardMap = {};
  for( let card of cards )
  {
    cardMap[ card.id ] = card;
  }
  return cardMap;
}

export function toCardArray( cards: CardMap )
{
  return Object.keys( cards ).map( ( id ) => cards[ id ] );
}
