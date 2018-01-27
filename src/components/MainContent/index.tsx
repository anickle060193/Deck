import * as React from 'react';

import Card, { Suit, Rank } from 'components/Card';

interface State
{
  suit: Suit;
}

export default class MainContent extends React.Component<{}, State>
{
  constructor( props: {} )
  {
    super( props );

    this.state = {
      suit: Suit.Hearts
    };
  }

  render()
  {
    let cardSize = 180;

    return (
      <>
      <div className="w-100 h-100 p-4" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {
          Object.keys( Rank ).map( ( rank ) => (
            <Card key={this.state.suit + rank} suit={this.state.suit} rank={rank as Rank} size={cardSize} />
          ) )
        }
      </div>
      <div style={{ position: 'absolute', left: 100, top: 10 }}>
        <select onChange={( e ) => { console.log( e.target.value ); this.setState( { suit: e.target.value as Suit } ); }}>
          {
            Object.keys( Suit ).map( ( suit ) =>
              (
                <option key={suit} value={suit}>{suit}</option>
              ) )
          }
        </select>
      </div>
      </>
    );
  }
}
