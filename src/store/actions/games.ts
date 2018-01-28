import { Action } from 'redux';
import { Game } from 'utils/game';

export const enum GamesActions
{
  LoadLastGame = 'LOAD_LAST_GAME__GAMES',
  LoadLastGameResult = 'LOAD_LAST_GAME_RESULT__GAMES',
  LoadLastGameError = 'LOAD_LAST_GAME_ERROR__GAMES',
  OpenGame = 'OPEN_GAME__GAMES',
  OpenGameResult = 'OPEN_GAME_RESULT__GAMES',
  OpenGameError = 'OPEN_GAME_ERROR__GAMES',
  CreateGame = 'CREATE_GAME__GAMES',
  CreateGameResult = 'CREATE_GAME_RESULT__GAMES',
  CreateGameError = 'CREATE_GAME_ERROR__GAMES'
}

export interface LoadLastGameAction extends Action
{
  type: GamesActions.LoadLastGame;
}

export interface LoadLastGameResultAction extends Action
{
  type: GamesActions.LoadLastGameResult;
  game: Game | null;
}

export interface LoadLastGameErrorAction extends Action
{
  type: GamesActions.LoadLastGameError;
  error: Error;
}

export interface OpenGameAction extends Action
{
  type: GamesActions.OpenGame;
  gameId: string;
}

export interface OpenGameResultAction extends Action
{
  type: GamesActions.OpenGameResult;
  game: Game | null;
}

export interface OpenGameErrorAction extends Action
{
  type: GamesActions.OpenGameError;
  error: Error;
}

export interface CreateGameAction extends Action
{
  type: GamesActions.CreateGame;
}

export interface CreateGameResultAction extends Action
{
  type: GamesActions.CreateGameResult;
  game: Game;
}

export interface CreateGameErrorAction extends Action
{
  type: GamesActions.CreateGameError;
  error: Error;
}

export type GamesAction = (
  LoadLastGameAction |
  LoadLastGameResultAction |
  LoadLastGameErrorAction |
  OpenGameAction |
  OpenGameResultAction |
  OpenGameErrorAction |
  CreateGameAction |
  CreateGameResultAction |
  CreateGameErrorAction
);

export const loadLastGame = (): LoadLastGameAction => ( {
  type: GamesActions.LoadLastGame
} );

export const loadLastGameResult = ( game: Game | null ): LoadLastGameResultAction => ( {
  type: GamesActions.LoadLastGameResult,
  game
} );

export const loadLastGameError = ( error: Error ): LoadLastGameErrorAction => ( {
  type: GamesActions.LoadLastGameError,
  error
} );

export const openGame = ( gameId: string ): OpenGameAction => ( {
  type: GamesActions.OpenGame,
  gameId
} );

export const openGameResult = ( game: Game | null ): OpenGameResultAction => ( {
  type: GamesActions.OpenGameResult,
  game
} );

export const openGameError = ( error: Error ): OpenGameErrorAction => ( {
  type: GamesActions.OpenGameError,
  error
} );

export const createGame = (): CreateGameAction => ( {
  type: GamesActions.CreateGame
} );

export const createGameResult = ( game: Game ): CreateGameResultAction => ( {
  type: GamesActions.CreateGameResult,
  game
} );

export const createGameError = ( error: Error ): CreateGameErrorAction => ( {
  type: GamesActions.CreateGameError,
  error
} );
