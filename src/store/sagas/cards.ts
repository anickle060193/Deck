import { eventChannel } from 'redux-saga';
import { takeEvery, call, put, take, select } from 'redux-saga/effects';

import
{
  RetrieveCardsAction,
  CardActions,
  MoveCardAction,
  setCards,
  CardAction,
  GatherCardsAction,
  ScatterCardsAction,
  selectCards,
  FlipCardsAction,
  ShuffleCardsAction,
  FlipDeckAction,
} from 'store/actions/cards';
import * as db from 'utils/db';
import { Card, toCardMap, CardMap, toCardArray, cardSorter } from 'utils/card';
import { shuffle } from 'utils/utils';

function* retrieveCards( action: RetrieveCardsAction )
{
  let channel = eventChannel<Card[]>( ( emit ) =>
  {
    return db.listenForCards( action.gameId, emit );
  } );

  yield takeEvery( channel, function* ( cards: Card[] )
  {
    let cardMap = toCardMap( cards );
    yield put( setCards( cardMap ) );
  } );

  yield take( ( a: CardAction ) => (
    a.type === CardActions.StopRetrievingCards
    && a.gameId === action.gameId
  ) );
  channel.close();

  yield put( setCards( {} ) );
  yield put( selectCards( [] ) );
}

function* moveCard( action: MoveCardAction )
{
  yield call( db.moveCard, action.gameId, action.cardId, action.x, action.y );
}

function* gatherCards( action: GatherCardsAction )
{
  let cardMap: CardMap = yield select<RootState>( ( state ) => state.cards.cards );
  let cards = toCardArray( cardMap )
    .filter( ( { id } ) => action.cardIds.indexOf( id ) !== -1 )
    .sort( cardSorter );

  cards.forEach( ( card, i ) =>
  {
    card.x = action.x - i * 0.0001;
    card.y = action.y + i * 0.0001;
  } );
  yield call( db.saveCards, action.gameId, cards );
}

function* scatterCards( action: ScatterCardsAction )
{
  let cardMap: CardMap = yield select<RootState>( ( state ) => state.cards.cards );
  let cards = toCardArray( cardMap );
  shuffle( cards );
  cards.forEach( ( card, i ) =>
  {
    card.index = new Date( i );
    card.x = Math.random() * 0.8;
    card.y = Math.random() * 0.8;
  } );
  yield call( db.saveCards, action.gameId, cards );
}

function* flipCards( action: FlipCardsAction )
{
  yield call( db.flipCards, action.gameId, action.cardIds, action.faceDown );
}

function* shuffleCards( action: ShuffleCardsAction )
{
  let cardMap: CardMap = yield select<RootState>( ( state ) => state.cards.cards );
  let cards = toCardArray( cardMap )
    .filter( ( { id } ) => action.cardIds.indexOf( id ) !== -1 );

  shuffle( cards ).forEach( ( card, i ) =>
  {
    card.index = new Date( i );
  } );
  yield call( db.saveCards, action.gameId, cards );
}

function* flipDeck( action: FlipDeckAction )
{
  let cardMap: CardMap = yield select<RootState>( ( state ) => state.cards.cards );
  let cards = toCardArray( cardMap )
    .filter( ( { id } ) => action.cardIds.indexOf( id ) !== -1 )
    .sort( cardSorter );

  for( let i = 0; i < cards.length / 2; i++ )
  {
    let index = cards[ i ].index;
    cards[ i ].index = cards[ cards.length - i - 1 ].index;
    cards[ cards.length - i - 1 ].index = index;
  }

  cards.forEach( ( card ) => card.faceDown = !card.faceDown );

  yield call( db.saveCards, action.gameId, cards );
}

export default function* ()
{
  yield takeEvery( CardActions.RetrieveCards, retrieveCards );
  yield takeEvery( CardActions.MoveCard, moveCard );
  yield takeEvery( CardActions.GatherCards, gatherCards );
  yield takeEvery( CardActions.ScatterCards, scatterCards );
  yield takeEvery( CardActions.FlipCards, flipCards );
  yield takeEvery( CardActions.ShuffleCards, shuffleCards );
  yield takeEvery( CardActions.FlipDeck, flipDeck );
}
