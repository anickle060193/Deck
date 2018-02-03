import { createStore, applyMiddleware, Middleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

import rootReducer from 'store/reducers';
import rootSaga from 'store/sagas';

export const configureStore = ( initialState?: RootState ) =>
{
  const sagaMiddleware = createSagaMiddleware();

  const middlewares: Middleware[] = [
    sagaMiddleware
  ];

  if( process.env.NODE_ENV === 'development' )
  {
    middlewares.push( createLogger( {
      collapsed: true,
      diff: true,
      duration: true
    } ) );
  }

  const store = createStore( rootReducer, applyMiddleware( ...middlewares ) );

  sagaMiddleware.run( rootSaga );

  return store;
};
