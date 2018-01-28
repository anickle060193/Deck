import { takeEvery, call, put } from 'redux-saga/effects';

import { RetrieveCardsAction, CardActions, setCards, MoveCardAction } from 'store/actions/cards';
import * as db from 'utils/db';
import { Card, CardMap } from 'utils/card';

function* retrieveCards( action: RetrieveCardsAction )
{
  let cards: Card[] = yield call( db.getCards, action.gameId );
  let cardMap = cards.reduce( ( allCards, card ) =>
  {
    allCards[ card.id ] = card;
    return allCards;
  }, {} as CardMap );
  yield put( setCards( cardMap ) );
}

function* moveCard( action: MoveCardAction )
{
  yield call( db.moveCard, action.gameId, action.cardId, action.x, action.y );
}

export default function* ()
{
  yield takeEvery( CardActions.RetrieveCards, retrieveCards );
  yield takeEvery( CardActions.MoveCard, moveCard );
}
