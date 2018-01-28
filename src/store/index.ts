import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

import rootReducer from 'store/reducers';
import rootSaga from 'store/sagas';

export const configureStore = ( initialState?: RootState ) =>
{
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [
    sagaMiddleware,
    logger
  ];

  const store = createStore( rootReducer, applyMiddleware( ...middlewares ) );

  sagaMiddleware.run( rootSaga );

  return store;
};
