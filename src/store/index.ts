import { createStore, applyMiddleware, Middleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as ReduxLogger from 'redux-logger';

import rootReducer from 'store/reducers';
import rootSaga from 'store/sagas';

const sagaMiddleware = createSagaMiddleware();

const middlewares: Middleware[] = [
  sagaMiddleware
];

if( process.env.NODE_ENV === 'development' )
{
  const { createLogger } = require( 'redux-logger' ) as typeof ReduxLogger;
  middlewares.unshift( createLogger( {
    collapsed: true,
    diff: true,
    duration: true
  } ) );
}

const store = createStore( rootReducer, applyMiddleware( ...middlewares ) );

sagaMiddleware.run( rootSaga );

export default store;
