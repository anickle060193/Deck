import * as React from 'react';

import Card, { Suit, Rank } from 'components/Card';

export default class MainContent extends React.Component
{
  render()
  {
    let cardSize = 180;

    return (
      <div className="w-100 h-100 p-4" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Card suit={Suit.Spades} rank={Rank.Ace} size={cardSize} />
        <Card suit={Suit.Spades} rank={Rank.Two} size={cardSize} />
        <Card suit={Suit.Spades} rank={Rank.Three} size={cardSize} />
        <Card suit={Suit.Spades} rank={Rank.Four} size={cardSize} />
        <Card suit={Suit.Spades} rank={Rank.Five} size={cardSize} />
        <Card suit={Suit.Spades} rank={Rank.Six} size={cardSize} />
        <Card suit={Suit.Spades} rank={Rank.Seven} size={cardSize} />
        <Card suit={Suit.Spades} rank={Rank.Eight} size={cardSize} />
        <Card suit={Suit.Spades} rank={Rank.Nine} size={cardSize} />
        <Card suit={Suit.Spades} rank={Rank.Ten} size={cardSize} />
        <Card suit={Suit.Spades} rank={Rank.Jack} size={cardSize} />
        <Card suit={Suit.Spades} rank={Rank.Queen} size={cardSize} />
        <Card suit={Suit.Spades} rank={Rank.King} size={cardSize} />
      </div>
    );
  }
}
