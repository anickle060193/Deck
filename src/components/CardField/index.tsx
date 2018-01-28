import * as React from 'react';
import { connect } from 'react-redux';
import { Stage, Layer } from 'react-konva';

import PlayingCard from 'components/PlayingCard';
import { Card } from 'utils/card';
import { moveCard } from 'store/actions/cards';
import { Game } from 'utils/game';

interface PropsFromState
{
  game: Game | null;
  cards: { [ id: string ]: Card };
}

interface PropsFromDispatch
{
  moveCard: typeof moveCard;
}

type Props = PropsFromState & PropsFromDispatch;

interface State
{
  width: number;
  height: number;
}

class CardField extends React.Component<Props, State>
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
    let cards = Object
      .keys( this.props.cards )
      .map( ( id ) => this.props.cards[ id ] )
      .sort( ( cardA, cardB ) => ( cardA.index - cardB.index ) );

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
            {cards.map( ( card ) => (
              <PlayingCard
                key={card.id}
                x={card.x}
                y={card.y}
                size={100}
                suit={card.suit}
                rank={card.rank}
                onMove={( x, y ) => this.onCardMove( card, x, y )}
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

  private onCardMove = ( card: Card, x: number, y: number ) =>
  {
    if( this.props.game )
    {
      this.props.moveCard( this.props.game.id, card.id, x, y );
    }
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    game: state.games.game,
    cards: state.cards.cards
  } ),
  {
    moveCard
  }
)( CardField );
