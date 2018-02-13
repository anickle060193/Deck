import { Reducer } from 'redux';

import { CardAction, CardActions } from 'store/actions/cards';
import { CardMap, toCardMap, toCardArray, cardSorter } from 'utils/card';

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
      {
        let nextCardIndex = Math.max( ...toCardArray( state.cards ).map( ( card ) => card.index ) ) + 1;
        return {
          ...state,
          cards: {
            ...state.cards,
            [ action.cardId ]: {
              ...state.cards[ action.cardId ],
              index: nextCardIndex
            }
          }
        };
      }

    case CardActions.MoveCards:
      {
        let nextCardIndex = Math.max( ...toCardArray( state.cards ).map( ( card ) => card.index ) ) + 1;
        let cards = action.cardIds
          .map( ( cardId ) => state.cards[ cardId ] )
          .sort( cardSorter )
          .reverse();
        return {
          ...state,
          cards: {
            ...state.cards,
            ...toCardMap( cards.map( ( card ) =>
            {
              return {
                ...card,
                index: nextCardIndex++,
                x: card.x + action.xOffset,
                y: card.y + action.yOffset
              };
            } ) )
          }
        };
      }

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

    case CardActions.ShuffleCards:
      return state;

    case CardActions.FlipDeck:
      return state;

    default:
      return state;
  }
};
