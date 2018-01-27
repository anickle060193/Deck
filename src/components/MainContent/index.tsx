import * as React from 'react';

import CardField from 'components/CardField';
import { Rank, Suit, SUITS, RANKS } from 'components/Card';

const cards = RANKS.reverse().map( ( rank ) => ( SUITS.map( ( suit ) => ( { suit: suit as Suit, rank: rank as Rank } ) ) ) )
  .reduce( ( cardsBySuit, allCards ) =>
  {
    allCards.push( ...cardsBySuit );
    return allCards;
  }, [] );

export default class MainContent extends React.Component
{
  render()
  {
    return (
      <CardField cards={cards} />
    );
  }
}
