import { Action } from 'redux';

import { Card } from 'utils/card';

export const enum CardActions
{
  SetCards = 'SET_CARDS__CARDS',
  MoveCard = 'MOVE_CARD__CARDS'
}

export interface SetCardsAction extends Action
{
  type: CardActions.SetCards;
  cards: { [ id: string ]: Card };
}

export interface MoveCardAction extends Action
{
  type: CardActions.MoveCard;
  cardId: string;
  x: number;
  y: number;
}

export type CardAction = SetCardsAction | MoveCardAction;

export const setCards = ( cards: { [ id: string ]: Card } ): SetCardsAction => ( {
  type: CardActions.SetCards,
  cards
} );

export const moveCard = ( cardId: string, x: number, y: number ): MoveCardAction => ( {
  type: CardActions.MoveCard,
  cardId,
  x,
  y
} );
