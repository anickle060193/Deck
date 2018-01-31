import { Reducer } from 'redux';

import { GamesAction, GamesActions } from 'store/actions/games';
import { Game } from 'utils/game';

export interface State
{
  game: Game | null;
  loading: boolean;
  creating: boolean;
  error: Error | null;
}

const initialState: State = {
  game: null,
  loading: false,
  creating: false,
  error: null
};

export const reducer: Reducer<State> = ( state = initialState, action: GamesAction ) =>
{
  switch( action.type )
  {
    case GamesActions.LoadGame:
      return {
        ...state,
        loading: true,
        error: null
      };

    case GamesActions.LoadGameResult:
      return {
        ...state,
        loading: false,
        error: null,
        game: action.game
      };

    case GamesActions.LoadGameError:
      return {
        ...state,
        loading: false,
        game: null,
        error: action.error
      };

    case GamesActions.LoadLastGame:
      return state;

    case GamesActions.CreateGame:
      return {
        ...state,
        creating: true,
        error: null
      };

    default:
      return state;
  }
};
