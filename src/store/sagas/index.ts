import { all, fork } from 'redux-saga/effects';

import cardsSaga from 'store/sagas/cards';
import gamesSaga from 'store/sagas/games';

export default function* ()
{
  yield all( [
    fork( cardsSaga ),
    fork( gamesSaga )
  ] );
}
