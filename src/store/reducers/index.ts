import { combineReducers } from 'redux';

import { State as CardState, reducer as cardReducer } from 'store/reducers/cards';
import { State as GameState, reducer as gameReducer } from 'store/reducers/games';

declare global
{
  interface RootState
  {
    cards: CardState;
    games: GameState;
  }
}

export default combineReducers<RootState>( {
  cards: cardReducer,
  games: gameReducer
} );
