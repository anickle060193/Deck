import * as React from 'react';
import { Stage, Layer } from 'react-konva';

import Card, { Suit, Rank } from 'components/Card';

interface Props
{
  cards: { suit: Suit, rank: Rank }[];
}

interface State
{
  width: number;
  height: number;
}

export default class CardField extends React.Component<Props, State>
{
  parentRef: HTMLDivElement | null = null;

  constructor( props: Props )
  {
    super( props );

    this.state = {
      width: 100,
      height: 100,
    };
  }

  componentDidMount()
  {
    this.updateSize();

    window.addEventListener( 'resize', this.updateSize );
  }

  componentWillUnmount()
  {
    window.removeEventListener( 'resize', this.updateSize );
  }

  render()
  {
    return (
      <div
        className="w-100 h-100"
        ref={( ref ) => this.parentRef = ref}
      >
        <Stage
          width={this.state.width}
          height={this.state.height}
        >
          <Layer>
            {this.props.cards.map( ( { suit, rank } ) => (
              <Card
                key={suit + rank}
                x={Math.random() * 600}
                y={Math.random() * 600}
                size={100}
                suit={suit}
                rank={rank}
              />
            ) )}
          </Layer>
        </Stage>
      </div>
    );
  }

  private updateSize = () =>
  {
    if( this.parentRef )
    {
      this.setState( {
        width: this.parentRef.clientWidth,
        height: this.parentRef.clientHeight
      } );
    }
  }
}
