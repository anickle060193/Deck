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

export interface CardBase
{
  suit: Suit;
  rank: Rank;
  index: Date | null | number;
  x: number;
  y: number;
  faceDown: boolean;
}

export interface Card extends CardBase
{
  id: string;
}

export interface CardUpdate extends Partial<CardBase>
{
  id: string;
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

function rand( min: number, max: number )
{
  return ( Math.floor( Math.random() * ( max - min + 1 ) ) + min );
}

export function shuffle<T>( items: T[] )
{
  for( let i = 0; i < items.length - 2; i++ )
  {
    let j = rand( i, items.length - 1 );
    [ items[ i ], items[ j ] ] = [ items[ j ], items[ i ] ];
  }
  return items;
}
