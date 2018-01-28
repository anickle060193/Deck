import { Reducer } from 'redux';

import { CardAction, CardActions } from 'store/actions/cards';
import { CardMap } from 'utils/card';

export interface State
{
  loading: boolean;
  error: Error | null;
  cards: CardMap;
}

const initialState: State = {
  loading: false,
  error: null,
  cards: {}
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

    case CardActions.RetrieveCardsResult:
      return {
        ...state,
        loading: false,
        error: null,
        cards: action.cards
      };

    case CardActions.RetrieveCardsError:
      return {
        ...state,
        loading: false,
        cards: {},
        error: action.error
      };

    case CardActions.SetCards:
      return {
        ...state,
        cards: action.cards
      };

    case CardActions.MoveCard:
      return {
        ...state,
        cards: {
          ...state.cards,
          [ action.cardId ]: {
            ...state.cards[ action.cardId ],
            x: action.x,
            y: action.y
          }
        }
      };

    default:
      return state;
  }
};
