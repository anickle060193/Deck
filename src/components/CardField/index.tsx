import * as React from 'react';
import { connect } from 'react-redux';

import PlayingCard from 'components/CardField/PlayingCard';
import ContextMenu from 'components/ContextMenu';
import Selection from 'components/CardField/Selection';

import { Card, cardSorter, toCardArray } from 'utils/card';
import { moveCard, touchCard, gatherCards, scatterCards, selectCards, deselectCards, flipCards } from 'store/actions/cards';
import { Game } from 'utils/game';

const CARD_RATIO = 88.9 / 63.50;

interface PropsFromState
{
  game: Game;
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
  deselectCards: typeof deselectCards;
  flipCards: typeof flipCards;
}

type Props = PropsFromState & PropsFromDispatch;

interface State
{
  width: number;
  height: number;
  cardWidth: number;
  cardHeight: number;

  selectionX: number;
  selectionY: number;
  selectionWidth: number;
  selectionHeight: number;
  selectionVisible: boolean;

  contextMenuX: number;
  contextMenuY: number;
  contextMenuOpen: boolean;

  cardContextMenuX: number;
  cardContextMenuY: number;
  cardContextMenuOpen: boolean;
}

class CardField extends React.Component<Props, State>
{
  parentRef: HTMLDivElement | null;
  mouseDown: boolean;
  contextCard: Card | null;

  constructor( props: Props )
  {
    super( props );

    this.state = {
      width: 100,
      height: 100,
      cardWidth: 100,
      cardHeight: 100 * CARD_RATIO,

      selectionX: 0,
      selectionY: 0,
      selectionWidth: 0,
      selectionHeight: 0,
      selectionVisible: false,

      contextMenuX: -1,
      contextMenuY: -1,
      contextMenuOpen: false,

      cardContextMenuX: -1,
      cardContextMenuY: -1,
      cardContextMenuOpen: false
    };

    this.parentRef = null;
    this.mouseDown = false;
    this.contextCard = null;
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
    let cards = toCardArray( this.props.cards ).sort( cardSorter ).reverse();

    return (
      <>
      <div
        className="w-100 h-100 position-relative"
        ref={( ref ) => this.parentRef = ref}
        onContextMenu={this.onContextMenu}
        onMouseDown={this.onBackgroundMouseDown}
      >
        {cards.map( ( card ) => (
          <PlayingCard
            key={card.id}
            x={card.x * this.state.width}
            y={card.y * this.state.height}
            width={this.state.cardWidth}
            height={this.state.cardHeight}
            card={card}
            selected={this.props.selectedCardIds.has( card.id )}
            showContextMenu={this.props.selectedCardIds.size === 0}
            onContextMenu={( pageX, pageY ) => this.onCardContextMenu( card, pageX, pageY )}
            onDoubleClick={() => this.onFlipCard( card )}
            onTouch={() => this.onCardTouch( card )}
            onMove={( x, y ) => this.onCardMove( card, x, y )}
          />
        ) )}
        <Selection
          x={this.state.selectionX}
          y={this.state.selectionY}
          width={this.state.selectionWidth}
          height={this.state.selectionHeight}
          visible={this.state.selectionVisible}
        />
      </div>

      <ContextMenu
        x={this.state.contextMenuX}
        y={this.state.contextMenuY}
        open={this.state.contextMenuOpen}
        onClose={() => this.setState( { contextMenuOpen: false } )}
        actions={[
          { label: 'Flip Cards Face Up', onClick: () => this.onFlipCards( false ) },
          { label: 'Flip Cards Face Down', onClick: () => this.onFlipCards( true ) },
          { label: 'Gather Cards Here', onClick: this.onGatherHereClick },
          { label: 'Scatter Cards', onClick: this.onScatterCardsClick }
        ]}
      />

      <ContextMenu
        x={this.state.cardContextMenuX}
        y={this.state.cardContextMenuY}
        open={this.state.cardContextMenuOpen}
        onClose={() => this.setState( { cardContextMenuOpen: false } )}
        actions={[
          { label: 'Flip Card', onClick: () => this.onFlipCard( this.contextCard! ) }
        ]}
      />
      </>
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

  private onContextMenu = ( e: React.MouseEvent<{}> ) =>
  {
    if( this.parentRef )
    {
      e.preventDefault();
      e.persist();

      this.setState( {
        contextMenuX: e.clientX,
        contextMenuY: e.clientY,
        contextMenuOpen: true
      } );
    }
  }

  private onCardContextMenu = ( card: Card, pageX: number, pageY: number ) =>
  {
    this.contextCard = card;
    this.setState( {
      cardContextMenuOpen: true,
      cardContextMenuX: pageX,
      cardContextMenuY: pageY
    } );
  }

  private onBackgroundMouseDown = ( e: React.MouseEvent<{}> ) =>
  {
    if( e.button === 0 )
    {
      if( this.parentRef )
      {
        this.mouseDown = true;

        this.setState( {
          selectionX: e.clientX - this.parentRef.offsetLeft,
          selectionY: e.clientY - this.parentRef.offsetTop
        } );
      }
    }
  }

  private onMouseMove = ( e: MouseEvent ) =>
  {
    if( e.button === 0 && this.mouseDown )
    {
      if( this.parentRef )
      {
        let x = e.clientX - this.parentRef.offsetLeft;
        let y = e.clientY - this.parentRef.offsetTop;
        this.setState( {
          selectionWidth: x - this.state.selectionX,
          selectionHeight: y - this.state.selectionY,
          selectionVisible: true
        } );
      }
    }
  }

  private onMouseUp = ( e: MouseEvent ) =>
  {
    if( e.button === 0 )
    {
      if( this.mouseDown )
      {
        this.onSelection();
      }

      this.mouseDown = false;
      this.setState( {
        selectionVisible: false,
        selectionX: -1,
        selectionY: -1,
        selectionWidth: 0,
        selectionHeight: 0
      } );
    }
  }

  private onSelection = () =>
  {
    let { selectionX, selectionY, selectionWidth, selectionHeight } = this.state;

    if( selectionWidth === 0 || selectionHeight === 0 )
    {
      this.props.deselectCards();
      return;
    }

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

    let { width, height, cardWidth, cardHeight } = this.state;

    let selectedCardIds = toCardArray( this.props.cards )
      .filter( ( { x, y } ) =>
      {
        let cardLeft = x * width;
        let cardRight = cardLeft + cardWidth;
        let cardTop = y * height;
        let cardBottom = cardTop + cardHeight;

        return !( right < cardLeft || cardRight < left || bottom < cardTop || cardBottom < top );
      } )
      .map( ( { id } ) => id );

    this.props.selectCards( selectedCardIds );
  }

  private onCardTouch = ( card: Card ) =>
  {
    this.props.deselectCards();
    this.props.touchCard( this.props.game.id, card.id );
  }

  private onCardMove = ( card: Card, x: number, y: number ) =>
  {
    let xRatio = x / this.state.width;
    let yRatio = y / this.state.height;
    if( xRatio !== card.x || yRatio !== card.y )
    {
      this.props.moveCard( this.props.game.id, card.id, xRatio, yRatio );
    }
  }

  private onFlipCard = ( card: Card ) =>
  {
    this.props.flipCards( this.props.game.id, [ card.id ], !card.faceDown );
  }

  private onFlipCards = ( faceDown: boolean ) =>
  {
    if( this.props.selectedCardIds.size === 0 )
    {
      this.props.flipCards( this.props.game.id, Object.keys( this.props.cards ), faceDown );
    }
    else
    {
      this.props.flipCards( this.props.game.id, Array.from( this.props.selectedCardIds ), faceDown );
    }
  }

  private onGatherHereClick = () =>
  {
    if( this.parentRef )
    {
      let x = ( this.state.contextMenuX - this.parentRef.offsetLeft - this.state.cardWidth / 2 ) / this.state.width;
      let y = ( this.state.contextMenuY - this.parentRef.offsetTop - this.state.cardHeight / 2 ) / this.state.height;

      if( this.props.selectedCardIds.size === 0 )
      {
        this.props.gatherCards( this.props.game.id, Object.keys( this.props.cards ), x, y );
      }
      else
      {
        this.props.gatherCards( this.props.game.id, Array.from( this.props.selectedCardIds ), x, y );
      }
      this.props.deselectCards();
    }
  }

  private onScatterCardsClick = () =>
  {
    this.props.scatterCards( this.props.game.id );
    this.props.deselectCards();
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    game: state.games.game!,
    cards: state.cards.cards,
    selectedCardIds: state.cards.selectedCardIds
  } ),
  {
    moveCard,
    touchCard,
    gatherCards,
    scatterCards,
    selectCards,
    deselectCards,
    flipCards
  }
)( CardField );
