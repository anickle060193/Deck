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
      return state;

    case CardActions.MoveCard:
      return state;

    case CardActions.GatherCards:
      return state;

    case CardActions.ScatterCards:
      return state;

    case CardActions.SelectCards:
      return {
        ...state,
        selectedCardIds: new Set( action.cardIds )
      };

    default:
      return state;
  }
};
