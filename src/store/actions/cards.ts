import { Action } from 'redux';

import { CardMap } from 'utils/card';

export const enum CardActions
{
  RetrieveCards = 'RETRIEVE_CARDS__CARDS',
  StopRetrievingCards = 'STOP_RETRIEVING_CARDS__CARDS',
  SetCards = 'SET_CARDS__CARDS',
  TouchCard = 'TOUCH_CARD__CARDS',
  MoveCard = 'MOVE_CARD__CARDS',
  GatherCards = 'GATHER_CARDS__CARDS',
  ScatterCards = 'SCATTER_CARDS__CARDS',
  SelectCards = 'SELECT_CARDS__CARDS',
  DeselectCards = 'DESELECT_CARDS__CARDS'
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

export interface TouchCardAction extends Action
{
  type: CardActions.TouchCard;
  gameId: string;
  cardId: string;
}

export interface MoveCardAction extends Action
{
  type: CardActions.MoveCard;
  gameId: string;
  cardId: string;
  x: number;
  y: number;
}

export interface GatherCardsAction extends Action
{
  type: CardActions.GatherCards;
  gameId: string;
  cardIds: string[];
  x: number;
  y: number;
}

export interface ScatterCardsAction extends Action
{
  type: CardActions.ScatterCards;
  gameId: string;
}

export interface SelectCardsAction extends Action
{
  type: CardActions.SelectCards;
  cardIds: string[];
}

export interface DeselectCardsAction extends Action
{
  type: CardActions.DeselectCards;
}

export type CardAction = (
  RetrieveCardsAction |
  StopRetrievingCardsAction |
  SetCardsAction |
  TouchCardAction |
  MoveCardAction |
  GatherCardsAction |
  ScatterCardsAction |
  SelectCardsAction |
  DeselectCardsAction
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

export const touchCard = ( gameId: string, cardId: string ): TouchCardAction => ( {
  type: CardActions.TouchCard,
  gameId,
  cardId
} );

export const moveCard = ( gameId: string, cardId: string, x: number, y: number ): MoveCardAction => ( {
  type: CardActions.MoveCard,
  gameId,
  cardId,
  x,
  y
} );

export const gatherCards = ( gameId: string, cardIds: string[], x: number, y: number ): GatherCardsAction => ( {
  type: CardActions.GatherCards,
  gameId,
  cardIds,
  x,
  y
} );

export const scatterCards = ( gameId: string ): ScatterCardsAction => ( {
  type: CardActions.ScatterCards,
  gameId
} );

export const selectCards = ( cardIds: string[] ): SelectCardsAction => ( {
  type: CardActions.SelectCards,
  cardIds
} );

export const deselectCards = (): DeselectCardsAction => ( {
  type: CardActions.DeselectCards
} );
