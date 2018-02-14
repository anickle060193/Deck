import * as React from 'react';
import { connect } from 'react-redux';

import PlayingCard from 'components/CardField/PlayingCard';
import ContextMenu from 'components/ContextMenu';
import Selection from 'components/CardField/Selection';

import { Card, toCardArray } from 'utils/card';
import { Game } from 'utils/game';
import { compareByKey, compareTo } from 'utils/utils';
import
{
  moveCards,
  touchCard,
  gatherCards,
  scatterCards,
  selectCards,
  deselectCards,
  flipCards,
  shuffleCards,
  flipDeck
} from 'store/actions/cards';

const CARD_RATIO = 88.9 / 63.50;

interface PropsFromState
{
  game: Game;
  cards: { [ id: string ]: Card };
  selectedCardIds: Set<string>;
}

interface PropsFromDispatch
{
  moveCards: typeof moveCards;
  touchCard: typeof touchCard;
  gatherCards: typeof gatherCards;
  scatterCards: typeof scatterCards;
  selectCards: typeof selectCards;
  deselectCards: typeof deselectCards;
  flipCards: typeof flipCards;
  shuffleCards: typeof shuffleCards;
  flipDeck: typeof flipDeck;
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

  draggingCardIds: Set<string>;
  draggingOffsetX: number;
  draggingOffsetY: number;

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

      draggingCardIds: new Set(),
      draggingOffsetX: 0,
      draggingOffsetY: 0,

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
    let cards = toCardArray( this.props.cards ).sort( compareByKey<Card>( 'id' ) );
    let indices = cards
      .map( ( card ) => card.index )
      .sort( compareTo );

    return (
      <>
        <div
          className="w-100 h-100 position-relative"
          ref={( ref ) => this.parentRef = ref}
          onContextMenu={this.onContextMenu}
          onMouseDown={this.onBackgroundMouseDown}
        >
          {cards.map( ( card ) =>
          {
            let index = indices.indexOf( card.index );

            if( index < 0 )
            {
              index = 0;
            }

            let x = card.x;
            let y = card.y;
            let dragging = this.state.draggingCardIds.has( card.id );
            if( dragging )
            {
              x += this.state.draggingOffsetX;
              y += this.state.draggingOffsetY;
              index += cards.length;
            }

            return (
              <PlayingCard
                key={card.id}
                x={x * this.state.width}
                y={y * this.state.height}
                width={this.state.cardWidth}
                height={this.state.cardHeight}
                card={card}
                index={index}
                selected={this.props.selectedCardIds.has( card.id )}
                dragging={dragging}
                onMouseDown={( e ) => this.onCardMouseDown( card, e )}
                onClick={( e ) => this.onCardClick( card, e )}
                onDoubleClick={( e ) => this.onCardDoubleClick( card, e )}
                onContextMenu={( e ) => this.onCardContextMenu( card, e )}
              />
            );
          } )}
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
            { label: 'Flip Cards Face Up', onClick: () => this.onFlipCardsClick( false ) },
            { label: 'Flip Cards Face Down', onClick: () => this.onFlipCardsClick( true ) },
            { label: 'Gather Cards Here', onClick: this.onGatherHereClick },
            { label: 'Scatter Cards', onClick: this.onScatterCardsClick },
            { label: 'Shuffle Cards', onClick: this.onShuffleCardsClick },
            { label: 'Flip Deck', onClick: this.onFlipDeckClick }
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

  private getSelectedOrAllCardIds()
  {
    if( this.props.selectedCardIds.size === 0 )
    {
      return Object.keys( this.props.cards );
    }
    else
    {
      return Array.from( this.props.selectedCardIds );
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
    if( e.button === 0 )
    {
      if( this.parentRef )
      {
        if( this.state.draggingCardIds.size > 0 )
        {
          let xDiff = e.movementX / this.parentRef.clientWidth;
          let yDiff = e.movementY / this.parentRef.clientHeight;
          this.setState( ( { draggingOffsetX, draggingOffsetY } ) =>
            ( {
              draggingOffsetX: draggingOffsetX + xDiff,
              draggingOffsetY: draggingOffsetY + yDiff
            } ) );
        }
        else if( this.mouseDown )
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
  }

  private onMouseUp = ( e: MouseEvent ) =>
  {
    if( e.button === 0 )
    {
      if( this.state.draggingCardIds.size > 0 )
      {
        this.props.moveCards(
          this.props.game.id,
          Array.from( this.state.draggingCardIds ),
          this.state.draggingOffsetX,
          this.state.draggingOffsetY
        );

        this.setState( {
          draggingCardIds: new Set(),
          draggingOffsetX: 0,
          draggingOffsetY: 0
        } );
      }
      else if( this.mouseDown )
      {
        this.onSelection();

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

  private onCardMouseDown = ( card: Card, e: React.MouseEvent<{}> ) =>
  {
    if( e.button === 0 )
    {
      e.preventDefault();
      e.stopPropagation();

      if( this.props.selectedCardIds.size > 0 )
      {
        this.setState( {
          draggingCardIds: this.props.selectedCardIds,
          draggingOffsetX: 0,
          draggingOffsetY: 0
        } );
      }
      else
      {
        this.setState( {
          draggingCardIds: new Set( [ card.id ] ),
          draggingOffsetX: 0,
          draggingOffsetY: 0
        } );

        this.props.touchCard( this.props.game.id, card.id );
      }
    }
  }

  private onCardClick = ( card: Card, e: React.MouseEvent<{}> ) =>
  {
    e.preventDefault();
    e.stopPropagation();
  }

  private onCardDoubleClick = ( card: Card, e: React.MouseEvent<{}> ) =>
  {
    e.preventDefault();
    e.stopPropagation();

    this.props.flipCards( this.props.game.id, [ card.id ], !card.faceDown );
  }

  private onCardContextMenu = ( card: Card, e: React.MouseEvent<{}> ) =>
  {
    if( this.props.selectedCardIds.size > 0 )
    {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    this.contextCard = card;
    this.setState( {
      cardContextMenuOpen: true,
      cardContextMenuX: e.pageX,
      cardContextMenuY: e.pageY
    } );
  }

  private onFlipCardsClick = ( faceDown: boolean ) =>
  {
    this.props.flipCards( this.props.game.id, this.getSelectedOrAllCardIds(), faceDown );
  }

  private onGatherHereClick = () =>
  {
    if( this.parentRef )
    {
      let x = ( this.state.contextMenuX - this.parentRef.offsetLeft ) / this.state.width;
      let y = ( this.state.contextMenuY - this.parentRef.offsetTop ) / this.state.height;

      this.props.gatherCards( this.props.game.id, this.getSelectedOrAllCardIds(), x, y );
    }
  }

  private onScatterCardsClick = () =>
  {
    this.props.scatterCards( this.props.game.id );
  }

  private onShuffleCardsClick = () =>
  {
    this.props.shuffleCards( this.props.game.id, this.getSelectedOrAllCardIds() );
  }

  private onFlipDeckClick = () =>
  {
    this.props.flipDeck( this.props.game.id, this.getSelectedOrAllCardIds() );
  }

  private onFlipCard = ( card: Card ) =>
  {
    this.props.flipCards( this.props.game.id, [ card.id ], !card.faceDown );
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    game: state.games.game!,
    cards: state.cards.cards,
    selectedCardIds: state.cards.selectedCardIds
  } ),
  {
    moveCards,
    touchCard,
    gatherCards,
    scatterCards,
    selectCards,
    deselectCards,
    flipCards,
    shuffleCards,
    flipDeck
  }
)( CardField );
