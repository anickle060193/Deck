import * as React from 'react';
import { connect } from 'react-redux';
// import { Stage, Layer, Rect } from 'react-konva';

import PlayingCard from 'components/CardField/PlayingCard';
import ContextMenu from 'components/ContextMenu';
// import Selection from 'components/CardField/Selection';

import { Card, cardSorter, toCardArray } from 'utils/card';
import { moveCard, touchCard, gatherCards, scatterCards, selectCards } from 'store/actions/cards';
import { Game } from 'utils/game';

const CARD_RATIO = 88.9 / 63.50;

interface PropsFromState
{
  game: Game | null;
  cards: { [ id: string ]: Card };
  selectedCardIds: Set<String>;
}

interface PropsFromDispatch
{
  moveCard: typeof moveCard;
  touchCard: typeof touchCard;
  gatherCards: typeof gatherCards;
  scatterCards: typeof scatterCards;
  selectCards: typeof selectCards;
}

type Props = PropsFromState & PropsFromDispatch;

interface State
{
  width: number;
  height: number;
  cardWidth: number;
  cardHeight: number;

  mouseDown: boolean;
  selectionX: number;
  selectionY: number;
  selectionWidth: number;
  selectionHeight: number;
  selectionVisible: boolean;

  contextMenuOffsetX: number;
  contextMenuOffsetY: number;
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

      mouseDown: false,
      selectionX: 0,
      selectionY: 0,
      selectionWidth: 0,
      selectionHeight: 0,
      selectionVisible: false,

      contextMenuOffsetX: 0,
      contextMenuOffsetY: 0,
      contextMenuX: -1,
      contextMenuY: -1,
      contextMenuOpen: false
    };
  }

  componentDidMount()
  {
    this.updateSize();

    window.addEventListener( 'resize', this.updateSize );

    document.addEventListener( 'mousemove', this.onMouseMove );
    document.addEventListener( 'mouseup', this.onMouseUp );
  }

  componentWillUnmount()
  {
    window.removeEventListener( 'resize', this.updateSize );

    document.removeEventListener( 'mousemove', this.onMouseMove );
    document.removeEventListener( 'mouseup', this.onMouseUp );
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
        className="w-100 h-100 position-relative"
        ref={( ref ) => this.parentRef = ref}
        onContextMenu={( e ) => e.preventDefault()}
      >
        {cards.map( ( card ) => (
          <PlayingCard
            key={card.id}
            x={card.x * this.state.width}
            y={card.y * this.state.height}
            width={this.state.cardWidth}
            height={this.state.cardHeight}
            suit={card.suit}
            rank={card.rank}
            selected={this.props.selectedCardIds.has( card.id )}
            onTouch={() => this.onCardTouch( card )}
            onMove={( x, y ) => this.onCardMove( card, x, y )}
          />
        ) )}
        <ContextMenu
          x={this.state.contextMenuX + this.state.contextMenuOffsetX}
          y={this.state.contextMenuY + this.state.contextMenuOffsetY}
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

  /*
  private onBackgroundClick = ( e: KonvaTypes.MouseEvent ) =>
  {
    if( e.evt.button === 2 )
    {
      if( this.parentRef )
      {
        this.setState( {
          contextMenuOffsetX: this.parentRef.offsetLeft,
          contextMenuOffsetY: this.parentRef.offsetTop,
          contextMenuX: e.evt.offsetX,
          contextMenuY: e.evt.offsetY,
          contextMenuOpen: true
        } );
      }
    }
  }

  private onBackgroundMouseDown = ( e: KonvaTypes.MouseEvent ) =>
  {
    if( e.evt.button === 0 )
    {
      this.setState( {
        mouseDown: true,
        selectionX: e.evt.offsetX,
        selectionY: e.evt.offsetY
      } );
    }
  }
  */

  private onMouseMove = ( e: MouseEvent ) =>
  {
    if( e.button === 0 && this.state.mouseDown )
    {
      let x = e.clientX - this.parentRef!.offsetLeft;
      let y = e.clientY - this.parentRef!.offsetTop;
      this.setState( {
        mouseDown: true,
        selectionWidth: x - this.state.selectionX,
        selectionHeight: y - this.state.selectionY,
        selectionVisible: true
      } );
    }
  }

  private onMouseUp = ( e: MouseEvent ) =>
  {
    if( e.button === 0 )
    {
      if( this.state.mouseDown )
      {
        this.onSelection();
      }

      this.setState( {
        mouseDown: false,
        selectionVisible: false
      } );
    }
  }

  private onSelection = () =>
  {
    let { selectionX, selectionY, selectionWidth, selectionHeight } = this.state;

    let left: number, top: number, right: number, bottom: number;
    if( selectionWidth < 0 )
    {
      left = selectionX + selectionWidth;
      right = selectionX;
    }
    else
    {
      left = selectionX;
      right = selectionX + selectionWidth;
    }
    if( selectionHeight < 0 )
    {
      top = selectionY + selectionHeight;
      bottom = selectionY;
    }
    else
    {
      top = selectionY;
      bottom = selectionY + selectionHeight;
    }

    left /= this.state.width;
    right /= this.state.width;
    top /= this.state.height;
    bottom /= this.state.height;

    let selectedCardIds = toCardArray( this.props.cards )
      .filter( ( { x, y } ) => left <= x && x <= right && top <= y && y <= bottom )
      .map( ( { id } ) => id );

    this.props.selectCards( selectedCardIds );
  }

  private onCardTouch = ( card: Card ) =>
  {
    this.props.selectCards( [] );
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
      if( this.parentRef )
      {
        let x = ( this.state.contextMenuX - this.state.cardWidth / 2 ) / this.state.width;
        let y = ( this.state.contextMenuY - this.state.cardHeight / 2 ) / this.state.height;

        this.props.gatherCards( this.props.game.id, x, y );
      }
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
    cards: state.cards.cards,
    selectedCardIds: state.cards.selectedCardIds
  } ),
  {
    moveCard,
    touchCard,
    gatherCards,
    scatterCards,
    selectCards
  }
)( CardField );
