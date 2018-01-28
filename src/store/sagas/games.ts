import { takeEvery, call, put } from 'redux-saga/effects';

import
{
  GamesActions,
  LoadLastGameAction,
  CreateGameAction,
  loadLastGameError,
  createGameResult,
  createGameError,
  loadLastGameResult,
} from 'store/actions/games';
import * as db from 'utils/db';
import { RANKS, SUITS, Suit, Rank } from 'utils/card';
import { retrieveCards } from 'store/actions/cards';
import { Game } from 'utils/game';

const LAST_GAME_KEY = 'LAST_GAME';

function* loadLastGame( action: LoadLastGameAction )
{
  try
  {
    let lastGameId = localStorage.getItem( LAST_GAME_KEY );
    if( !lastGameId )
    {
      yield put( loadLastGameResult( null ) );
    }
    else
    {
      let game: Game | null = yield call( db.getGame, lastGameId );
      if( game )
      {
        yield put( loadLastGameResult( game ) );
        yield put( retrieveCards( game.id ) );
      }
      else
      {
        yield put( loadLastGameResult( null ) );
      }
    }
  }
  catch( e )
  {
    yield put( loadLastGameError( e ) );
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
      x: Math.random() * 500,
      y: Math.random() * 500,
      index: index++
    } ) ) ) )
      .reduce( ( allCards, cardsBySuit ) =>
      {
        allCards.push( ...cardsBySuit );
        return allCards;
      }, [] );

    let game: Game = yield call( db.createGame, cards );
    console.log( 'GAME:', game );
    localStorage.setItem( LAST_GAME_KEY, game.id );
    yield put( createGameResult( game ) );
    yield put( retrieveCards( game.id ) );
  }
  catch( e )
  {
    yield put( createGameError( e ) );
  }
}

export default function* ()
{
  yield takeEvery( GamesActions.LoadLastGame, loadLastGame );
  yield takeEvery( GamesActions.CreateGame, createGame );
}
