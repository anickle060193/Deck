import { Action } from 'redux';

import { CardMap } from 'utils/card';

export const enum CardActions
{
  RetrieveCards = 'RETRIEVE_CARDS__CARDS',
  RetrieveCardsResult = 'RETRIEVE_CARDS_RESULT__CARDS',
  RetrieveCardsError = 'RETRIEVE_CARDS_ERROR__CARDS',
  SetCards = 'SET_CARDS__CARDS',
  MoveCard = 'MOVE_CARD__CARDS'
}

export interface RetrieveCardsAction extends Action
{
  type: CardActions.RetrieveCards;
  gameId: string;
}

export interface RetrieveCardsResultAction extends Action
{
  type: CardActions.RetrieveCardsResult;
  cards: CardMap;
}

export interface RetrieveCardsErrorAction extends Action
{
  type: CardActions.RetrieveCardsError;
  error: Error;
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
  RetrieveCardsResultAction |
  RetrieveCardsErrorAction |
  SetCardsAction |
  MoveCardAction
);

export const retrieveCards = ( gameId: string ): RetrieveCardsAction => ( {
  type: CardActions.RetrieveCards,
  gameId
} );

export const retrieveCardsResult = ( cards: CardMap ): RetrieveCardsResultAction => ( {
  type: CardActions.RetrieveCardsResult,
  cards
} );

export const retrieveCardsError = ( error: Error ): RetrieveCardsErrorAction => ( {
  type: CardActions.RetrieveCardsError,
  error
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
