import { combineReducers } from 'redux';

import { State as CardState, reducer as cardReducer } from 'store/reducers/cards';

declare global
{
  interface RootState
  {
    cards: CardState;
  }
}

export default combineReducers<RootState>( {
  cards: cardReducer
} );
