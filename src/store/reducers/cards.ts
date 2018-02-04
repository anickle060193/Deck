import { Reducer } from 'redux';

import { CardAction, CardActions } from 'store/actions/cards';
import { CardMap } from 'utils/card';

export interface State
{
  loading: boolean;
  error: Error | null;
  cards: CardMap;
  selectedCardIds: Set<string>;
}

const initialState: State = {
  loading: false,
  error: null,
  cards: {},
  selectedCardIds: new Set()
};

export const reducer: Reducer<State> = ( state = initialState, action: CardAction ) =>
{
  switch( action.type )
  {
    case CardActions.RetrieveCards:
      return {
        ...state,
        loading: true,
        error: null,
        cards: {}
      };

    case CardActions.StopRetrievingCards:
      return state;

    case CardActions.SetCards:
      return {
        ...state,
        cards: action.cards
      };

    case CardActions.TouchCard:
      return {
        ...state,
        cards: {
          ...state.cards,
          [ action.cardId ]: {
            ...state.cards[ action.cardId ],
            index: new Date()
          }
        }
      };

    case CardActions.MoveCard:
      return {
        ...state,
        cards: {
          ...state.cards,
          [ action.cardId ]: {
            ...state.cards[ action.cardId ],
            x: action.x,
            y: action.y,
            index: new Date()
          }
        }
      };

    case CardActions.GatherCards:
      return state;

    case CardActions.ScatterCards:
      return state;

    case CardActions.SelectCards:
      return {
        ...state,
        selectedCardIds: new Set( action.cardIds )
      };

    case CardActions.DeselectCards:
      return {
        ...state,
        selectedCardIds: new Set()
      };

    case CardActions.FlipCards:
      return state;

    default:
      return state;
  }
};
