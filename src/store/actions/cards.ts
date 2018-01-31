import { Action } from 'redux';

import { CardMap } from 'utils/card';

export const enum CardActions
{
  RetrieveCards = 'RETRIEVE_CARDS__CARDS',
  StopRetrievingCards = 'STOP_RETRIEVING_CARDS__CARDS',
  SetCards = 'SET_CARDS__CARDS',
  MoveCard = 'MOVE_CARD__CARDS'
}

export interface RetrieveCardsAction extends Action
{
  type: CardActions.RetrieveCards;
  gameId: string;
}

export interface StopRetrievingCardsAction extends Action
{
  type: CardActions.StopRetrievingCards;
  gameId: string;
}

export interface SetCardsAction extends Action
{
  type: CardActions.SetCards;
  cards: CardMap;
}

export interface MoveCardAction extends Action
{
  type: CardActions.MoveCard;
  gameId: string;
  cardId: string;
  x: number;
  y: number;
}

export type CardAction = (
  RetrieveCardsAction |
  StopRetrievingCardsAction |
  SetCardsAction |
  MoveCardAction
);

export const retrieveCards = ( gameId: string ): RetrieveCardsAction => ( {
  type: CardActions.RetrieveCards,
  gameId
} );

export const stopRetrievingCards = ( gameId: string ): StopRetrievingCardsAction => ( {
  type: CardActions.StopRetrievingCards,
  gameId
} );

export const setCards = ( cards: CardMap ): SetCardsAction => ( {
  type: CardActions.SetCards,
  cards
} );

export const moveCard = ( gameId: string, cardId: string, x: number, y: number ): MoveCardAction => ( {
  type: CardActions.MoveCard,
  gameId,
  cardId,
  x,
  y
} );
