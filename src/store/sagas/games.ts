import { takeEvery, call, put, select } from 'redux-saga/effects';

import
{
  GamesActions,
  LoadLastGameAction,
  CreateGameAction,
  LoadGameAction,
  loadGame,
  loadGameResult,
  loadGameError
} from 'store/actions/games';
import * as db from 'utils/db';
import { RANKS, SUITS, Suit, Rank } from 'utils/card';
import { retrieveCards, stopRetrievingCards } from 'store/actions/cards';
import { Game } from 'utils/game';

const LAST_GAME_KEY = 'LAST_GAME';

function setLastGame( gameId: string )
{
  localStorage.setItem( LAST_GAME_KEY, gameId );
}

function* loadGameFromDb( action: LoadGameAction )
{
  try
  {
    let game: Game | null = yield call( db.getGame, action.gameId );
    if( game )
    {
      setLastGame( game.id );

      let lastGame: Game | null = yield select<RootState>( ( state ) => state.games.game );
      if( lastGame )
      {
        yield put( stopRetrievingCards( lastGame.id ) );
      }

      yield put( loadGameResult( game ) );
      yield put( retrieveCards( game.id ) );
    }
    else
    {
      yield put( loadGameResult( null ) );
    }
  }
  catch( e )
  {
    yield put( loadGameError( e ) );
  }
}

function* loadLastGame( action: LoadLastGameAction )
{
  let lastGameId = localStorage.getItem( LAST_GAME_KEY );
  if( lastGameId )
  {
    yield put( loadGame( lastGameId ) );
  }
}

function* createGame( action: CreateGameAction )
{
  try
  {
    let index = 0;
    const cards = RANKS.reverse().map( ( rank ) => ( SUITS.map( ( suit ) => ( {
      suit: suit as Suit,
      rank: rank as Rank,
      x: Math.random() * 0.8,
      y: Math.random() * 0.8,
      index: index++,
      faceDown: false
    } ) ) ) )
      .reduce( ( allCards, cardsBySuit ) =>
      {
        allCards.push( ...cardsBySuit );
        return allCards;
      }, [] );

    let game: Game = yield call( db.createGame, cards );

    yield put( loadGame( game.id ) );
  }
  catch( e )
  {
    yield put( loadGameError( e ) );
  }
}

export default function* ()
{
  yield takeEvery( GamesActions.LoadGame, loadGameFromDb );
  yield takeEvery( GamesActions.LoadLastGame, loadLastGame );
  yield takeEvery( GamesActions.CreateGame, createGame );
}
