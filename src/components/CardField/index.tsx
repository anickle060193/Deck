import * as React from 'react';
import { connect } from 'react-redux';
import { Stage, Layer } from 'react-konva';

import PlayingCard from 'components/PlayingCard';
import ContextMenu from 'components/ContextMenu';
import { Card, cardSorter } from 'utils/card';
import { moveCard, touchCard, gatherCards, scatterCards } from 'store/actions/cards';
import { Game } from 'utils/game';

const CARD_RATIO = 88.9 / 63.50;

interface PropsFromState
{
  game: Game | null;
  cards: { [ id: string ]: Card };
}

interface PropsFromDispatch
{
  moveCard: typeof moveCard;
  touchCard: typeof touchCard;
  gatherCards: typeof gatherCards;
  scatterCards: typeof scatterCards;
}

type Props = PropsFromState & PropsFromDispatch;

interface State
{
  width: number;
  height: number;
  cardWidth: number;
  cardHeight: number;
  contextMenuX: number;
  contextMenuY: number;
  contextMenuOpen: boolean;
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
      cardWidth: 100,
      cardHeight: 100 * CARD_RATIO,
      contextMenuX: -1,
      contextMenuY: -1,
      contextMenuOpen: false
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
      .sort( cardSorter )
      .reverse();

    return (
      <div
        className="w-100 h-100"
        ref={( ref ) => this.parentRef = ref}
        onContextMenu={( e ) => e.preventDefault()}
      >
        <Stage
          width={this.state.width}
          height={this.state.height}
          onContentClick={this.onContentClick}
        >
          <Layer>
            {cards.map( ( card ) => (
              <PlayingCard
                key={card.id}
                x={card.x * this.state.width}
                y={card.y * this.state.height}
                width={this.state.cardWidth}
                height={this.state.cardHeight}
                suit={card.suit}
                rank={card.rank}
                onTouch={() => this.onCardTouch( card )}
                onMove={( x, y ) => this.onCardMove( card, x, y )}
              />
            ) )}
          </Layer>
        </Stage>
        <ContextMenu
          x={this.state.contextMenuX}
          y={this.state.contextMenuY}
          open={this.state.contextMenuOpen}
          onClose={() => this.setState( { contextMenuOpen: false } )}
          actions={[
            { label: 'Gather Cards Here', onClick: this.onGatherHereClick },
            { label: 'Scatter Cards', onClick: this.onScatterCardsClick }
          ]}
        />
      </div>
    );
  }

  private updateSize = () =>
  {
    if( this.parentRef )
    {
      let width = this.parentRef.clientWidth;
      let height = this.parentRef.clientHeight;
      let cardWidth = Math.min( 100, width / 10 );
      let cardHeight = cardWidth * CARD_RATIO;

      this.setState( {
        width,
        height,
        cardWidth,
        cardHeight
      } );
    }
  }

  private onContentClick = ( e: KonvaTypes.Event<React.MouseEvent<{}>, {}> ) =>
  {
    if( e.evt.button === 2 )
    {
      this.setState( {
        contextMenuX: e.evt.pageX,
        contextMenuY: e.evt.pageY,
        contextMenuOpen: true
      } );
    }
  }

  private onCardTouch = ( card: Card ) =>
  {
    if( this.props.game )
    {
      this.props.touchCard( this.props.game.id, card.id );
    }
  }

  private onCardMove = ( card: Card, x: number, y: number ) =>
  {
    if( this.props.game )
    {
      let xRatio = x / this.state.width;
      let yRatio = y / this.state.height;
      this.props.moveCard( this.props.game.id, card.id, xRatio, yRatio );
    }
  }

  private onGatherHereClick = () =>
  {
    if( this.props.game )
    {
      let x = ( this.state.contextMenuX - this.state.cardWidth / 2 ) / this.state.width;
      let y = ( this.state.contextMenuY - this.state.cardHeight / 2 ) / this.state.height;

      this.props.gatherCards( this.props.game.id, x, y );
    }
  }

  private onScatterCardsClick = () =>
  {
    if( this.props.game )
    {
      this.props.scatterCards( this.props.game.id );
    }
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    game: state.games.game,
    cards: state.cards.cards
  } ),
  {
    moveCard,
    touchCard,
    gatherCards,
    scatterCards
  }
)( CardField );
