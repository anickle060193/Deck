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
    case GamesActions.LoadLastGame:
      return {
        ...state,
        loading: true,
        error: null
      };

    case GamesActions.LoadLastGameResult:
      return {
        ...state,
        loading: false,
        error: null,
        game: action.game
      };

    case GamesActions.LoadLastGameError:
      return {
        ...state,
        loading: false,
        game: null,
        error: action.error
      };

    case GamesActions.OpenGame:
      return {
        ...state,
        loading: true,
        error: null
      };

    case GamesActions.OpenGameResult:
      return {
        ...state,
        loading: false,
        error: null,
        game: action.game
      };

    case GamesActions.OpenGameError:
      return {
        ...state,
        loading: false,
        game: null,
        error: action.error
      };

    case GamesActions.CreateGame:
      return {
        ...state,
        creating: true,
        error: null
      };

    case GamesActions.CreateGameResult:
      return {
        ...state,
        creating: false,
        error: null,
        game: action.game
      };

    case GamesActions.CreateGameError:
      return {
        ...state,
        creating: false,
        game: null,
        error: action.error
      };

    default:
      return state;
  }
};
