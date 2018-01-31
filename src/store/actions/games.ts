import { Action } from 'redux';
import { Game } from 'utils/game';

export const enum GamesActions
{
  LoadGame = 'LOAD_GAME__GAMES',
  LoadGameResult = 'LOAD_GAME_RESULT__GAMES',
  LoadGameError = 'LOAD_GAME_ERROR__GAMES',
  LoadLastGame = 'LOAD_LAST_GAME__GAMES',
  CreateGame = 'CREATE_GAME__GAMES',
}

export interface LoadGameAction extends Action
{
  type: GamesActions.LoadGame;
  gameId: string;
}

export interface LoadGameResultAction extends Action
{
  type: GamesActions.LoadGameResult;
  game: Game | null;
}

export interface LoadGameErrorAction extends Action
{
  type: GamesActions.LoadGameError;
  error: Error;
}

export interface LoadLastGameAction extends Action
{
  type: GamesActions.LoadLastGame;
}

export interface CreateGameAction extends Action
{
  type: GamesActions.CreateGame;
}

export type GamesAction = (
  LoadGameAction |
  LoadGameResultAction |
  LoadGameErrorAction |
  LoadLastGameAction |
  CreateGameAction
);

export const loadGame = ( gameId: string ): LoadGameAction => ( {
  type: GamesActions.LoadGame,
  gameId
} );

export const loadGameResult = ( game: Game | null ): LoadGameResultAction => ( {
  type: GamesActions.LoadGameResult,
  game
} );

export const loadGameError = ( error: Error ): LoadGameErrorAction => ( {
  type: GamesActions.LoadGameError,
  error
} );

export const loadLastGame = (): LoadLastGameAction => ( {
  type: GamesActions.LoadLastGame
} );

export const createGame = (): CreateGameAction => ( {
  type: GamesActions.CreateGame
} );
