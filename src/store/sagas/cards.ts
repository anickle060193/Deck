import { eventChannel } from 'redux-saga';
import { takeEvery, call, put, take, select } from 'redux-saga/effects';

import
{
  RetrieveCardsAction,
  CardActions,
  MoveCardAction,
  setCards,
  CardAction,
  TouchCardAction,
  GatherCardsAction,
  ScatterCardsAction,
  selectCards,
} from 'store/actions/cards';
import * as db from 'utils/db';
import { Card, toCardMap, CardMap, toCardArray, cardSorter, shuffle } from 'utils/card';

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

function* touchCard( action: TouchCardAction )
{
  yield call( db.touchCard, action.gameId, action.cardId );
}

function* moveCard( action: MoveCardAction )
{
  yield call( db.moveCard, action.gameId, action.cardId, action.x, action.y );
}

function* gatherCards( action: GatherCardsAction )
{
  let cardMap: CardMap = yield select<RootState>( ( state ) => state.cards.cards );
  let cards = toCardArray( cardMap );
  cards.sort( cardSorter );
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
    card.index = i;
    card.x = Math.random() * 0.8;
    card.y = Math.random() * 0.8;
  } );
  yield call( db.saveCards, action.gameId, cards );
}

export default function* ()
{
  yield takeEvery( CardActions.RetrieveCards, retrieveCards );
  yield takeEvery( CardActions.TouchCard, touchCard );
  yield takeEvery( CardActions.MoveCard, moveCard );
  yield takeEvery( CardActions.GatherCards, gatherCards );
  yield takeEvery( CardActions.ScatterCards, scatterCards );
}
