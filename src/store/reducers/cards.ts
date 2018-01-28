import { Reducer } from 'redux';

import { CardAction, CardActions } from 'store/actions/cards';
import { Card } from 'utils/card';

export interface State
{
  cards: { [ id: string ]: Card };
}

const initialState: State = {
  cards: {}
};

export const reducer: Reducer<State> = ( state = initialState, action: CardAction ) =>
{
  switch( action.type )
  {
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
