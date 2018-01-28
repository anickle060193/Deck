import * as React from 'react';
import { Provider } from 'react-redux';

import AppBar from 'components/AppBar';
import MainContent from 'components/MainContent';
import { configureStore } from 'store';

const store = configureStore();

import { Rank, Suit, SUITS, RANKS, Card } from 'utils/card';
import { setCards } from 'store/actions/cards';

let index = 0;
const cards: { [ id: string ]: Card } = RANKS.reverse().map( ( rank ) => ( SUITS.map( ( suit ) => ( {
  id: Math.random().toString(),
  suit: suit as Suit,
  rank: rank as Rank,
  x: Math.random() * 500,
  y: Math.random() * 500,
  index: index++
} ) ) ) )
  .reduce( ( allCards, cardsBySuit ) =>
  {
    for( let card of cardsBySuit )
    {
      allCards[ card.id ] = card;
    }
    return allCards;
  }, {} );

store.dispatch( setCards( cards ) );

export default class App extends React.Component
{
  render()
  {
    return (
      <Provider store={store}>
        <div className="w-100 h-100 d-flex flex-column">
          <AppBar />
          <MainContent />
        </div>
      </Provider>
    );
  }
}
