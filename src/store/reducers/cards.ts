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

    case CardActions.StopRetrievingCards:
      return state;

    case CardActions.SetCards:
      return {
        ...state,
        cards: action.cards
      };

    case CardActions.TouchCard:
      return state;

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

    case CardActions.GatherCards:
      return state;

    case CardActions.ScatterCards:
      return state;

    default:
      return state;
  }
};
