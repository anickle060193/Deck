import { eventChannel } from 'redux-saga';
import { takeEvery, call, put, take } from 'redux-saga/effects';

import
{
  RetrieveCardsAction,
  CardActions,
  MoveCardAction,
  setCards,
  CardAction,
  TouchCardAction,
} from 'store/actions/cards';
import * as db from 'utils/db';
import { Card, CardMap } from 'utils/card';

function* retrieveCards( action: RetrieveCardsAction )
{
  let channel = eventChannel<Card[]>( ( emit ) =>
  {
    return db.listenForCards( action.gameId, emit );
  } );

  yield takeEvery( channel, function* ( cards: Card[] )
  {
    let cardMap = cards.reduce( ( allCards, card ) =>
    {
      allCards[ card.id ] = card;
      return allCards;
    }, {} as CardMap );

    yield put( setCards( cardMap ) );
  } );

  yield take( ( a: CardAction ) => (
    a.type === CardActions.StopRetrievingCards
    && a.gameId === action.gameId
  ) );
  channel.close();

  yield put( setCards( {} ) );
}

function* touchCard( action: TouchCardAction )
{
  yield call( db.touchCard, action.gameId, action.cardId );
}

function* moveCard( action: MoveCardAction )
{
  yield call( db.moveCard, action.gameId, action.cardId, action.x, action.y );
}

export default function* ()
{
  yield takeEvery( CardActions.RetrieveCards, retrieveCards );
  yield takeEvery( CardActions.TouchCard, touchCard );
  yield takeEvery( CardActions.MoveCard, moveCard );
}
