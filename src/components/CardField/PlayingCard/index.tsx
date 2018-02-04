import * as React from 'react';

import { Suit, Rank, Card } from 'utils/card';

import './styles.css';

function mapCreator<K extends string, V>( keyName: string, mapName: string, map: { [ key: string ]: V } )
{
  return ( key: K ) =>
  {
    if( !( key in map ) )
    {
      throw new Error( `Cannot retrieve ${mapName} with invalid ${keyName}: ${key}` );
    }
    return map[ key ];
  };
}

const suitToColor = mapCreator<Suit, string>( 'suit', 'color', {
  [ Suit.Spades ]: 'black',
  [ Suit.Clubs ]: 'black',
  [ Suit.Diamonds ]: 'red',
  [ Suit.Hearts ]: 'red'
} );

const suitToPath = mapCreator<Suit, string>( 'suit', 'path', {
  [ Suit.Spades ]: 'M24 36C-7 67 23 89 47 75 43 91 40 92 37 96L63 96C60 92 57 91 53 75 78 89 104 64 76 36 58 20 51 6 50 4 49 5 40 20 24 36Z',
  [ Suit.Clubs ]: 'M42 44C27 37 6 45 11 64 16 82 37 78 45 67 42 88 36 92 33 96L68 96C64 91 58 88 54 67 62 78 84 82 89 64 94 46 72 36 58 44 72 34 77 4 50 4 24 4 28 35 42 44Z',
  [ Suit.Diamonds ]: 'M50 1.93C39.55 18.65 28.055 34.325 16.56 50 29.1 65.675 40.595 81.35 50 98.07 59.405 81.35 70.9 64.63 83.44 50 70.9 34.325 59.405 17.605 50 1.93Z',
  [ Suit.Hearts ]: 'M52 96C51 96 51 95 51 94 48 86 44 78 37 69 34 65 32 62 25 54 17 44 15 41 12 37 11 34 9 30 9 28 9 25 9 21 9 19 11 11 18 4 27 4 38 3 46 8 51 18L52 20 53 18C54 16 55 14 57 12 62 6 67 4 74 4 77 4 79 4 82 5 85 6 88 8 91 11 98 19 97 30 89 43 87 46 83 50 78 56 73 63 70 66 67 70 60 78 56 86 54 94 53 95 53 96 53 96 52 97 52 97 52 96Z'
} );

const SuitPip: React.SFC<{
  suit: Suit;
  cardWidth: number
  cardHeight: number;
  x: number;
  y: number;
  scale?: number;
}> = ( { suit, cardWidth, cardHeight, x, y, scale = 1.0 } ) => (
  <svg
    width={( cardWidth * 0.0025 ) * scale * 100}
    height={( cardWidth * 0.0025 ) * scale * 100}
    viewBox="0 0 100 100"
    style={{
      left: x,
      top: y
    }}
  >
    <path
      d={suitToPath( suit )}
      style={{ fill: suitToColor( suit ) }}
    />
  </svg>
);

const CENTER = 0.5;

const LEFT = 0.25;
const RIGHT = 1 - LEFT;

const TOP = 0.22;
const BOTTOM = 1 - TOP;

const TL = [ LEFT, TOP ];
const TC = [ CENTER, TOP ];
const TR = [ RIGHT, TOP ];

const ML = [ LEFT, CENTER ];
const MC = [ CENTER, CENTER ];
const MR = [ RIGHT, CENTER ];

const BL = [ LEFT, BOTTOM ];
const BC = [ CENTER, BOTTOM ];
const BR = [ RIGHT, BOTTOM ];

const PERC_Y = ( p: number ) => ( ( BOTTOM - TOP ) * p + TOP );

const TMC = [ CENTER, PERC_Y( 0.25 ) ];
const BMC = [ CENTER, PERC_Y( 0.75 ) ];

const TMMC = [ CENTER, PERC_Y( 1 / 6 ) ];
const BMMC = [ CENTER, PERC_Y( 5 / 6 ) ];

const TMML = [ LEFT, PERC_Y( 1 / 3 ) ];
const BMML = [ LEFT, PERC_Y( 2 / 3 ) ];

const TMMR = [ RIGHT, PERC_Y( 1 / 3 ) ];
const BMMR = [ RIGHT, PERC_Y( 2 / 3 ) ];

const rankToLayout = mapCreator<Rank, number[][]>( 'rank', 'layout', {
  [ Rank.Ace ]: [ MC ],
  [ Rank.Two ]: [ TC, BC ],
  [ Rank.Three ]: [ TC, MC, BC ],
  [ Rank.Four ]: [ TL, BL, TR, BR ],
  [ Rank.Five ]: [ MC, TL, BL, TR, BR ],
  [ Rank.Six ]: [ TL, BL, TR, BR, ML, MR ],
  [ Rank.Seven ]: [ TL, BL, TR, BR, ML, MR, TMC ],
  [ Rank.Eight ]: [ TL, BL, TR, BR, ML, MR, TMC, BMC ],
  [ Rank.Nine ]: [ TL, BL, TR, BR, MC, TMML, BMML, TMMR, BMMR ],
  [ Rank.Ten ]: [ TL, BL, TR, BR, TMML, BMML, TMMR, BMMR, TMMC, BMMC ],
  [ Rank.Jack ]: [ MC ],
  [ Rank.Queen ]: [ MC ],
  [ Rank.King ]: [ MC ],
} );

const BIG_SCALE = 3.0;

const RANK_TO_SCALE = {
  [ Rank.Ace ]: BIG_SCALE,
  [ Rank.Jack ]: BIG_SCALE,
  [ Rank.Queen ]: BIG_SCALE,
  [ Rank.King ]: BIG_SCALE
};

const SuitPips: React.SFC<{
  suit: Suit;
  rank: Rank;
  cardWidth: number
  cardHeight: number;
}> = ( { suit, rank, cardWidth, cardHeight } ) => (
  <>
  {
    rankToLayout( rank ).map( ( [ x, y ], key ) => (
      <SuitPip
        key={key}
        x={cardWidth * x}
        y={cardHeight * y}
        suit={suit}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        scale={RANK_TO_SCALE[ rank ]}
      />
    ) )
  }
  </>
);

const rankToText = mapCreator<Rank, string>( 'rank', 'text', {
  [ Rank.Ace ]: 'A',
  [ Rank.Two ]: '2',
  [ Rank.Three ]: '3',
  [ Rank.Four ]: '4',
  [ Rank.Five ]: '5',
  [ Rank.Six ]: '6',
  [ Rank.Seven ]: '7',
  [ Rank.Eight ]: '8',
  [ Rank.Nine ]: '9',
  [ Rank.Ten ]: '10',
  [ Rank.Jack ]: 'J',
  [ Rank.Queen ]: 'Q',
  [ Rank.King ]: 'K',
} );

interface Props
{
  x: number;
  y: number;
  width: number;
  height: number;
  card: Card;
  selected: boolean;
  showContextMenu: boolean;
  onContextMenu: ( pageX: number, pageY: number ) => void;
  onDoubleClick: () => void;
  onTouch: () => void;
  onMove: ( x: number, y: number ) => void;
}

interface State
{
  x: number;
  y: number;
}

export default class PlayingCard extends React.Component<Props, State>
{
  mouseDown: boolean;
  lastX: number;
  lastY: number;

  constructor( props: Props )
  {
    super( props );

    this.state = {
      x: this.props.x,
      y: this.props.y
    };

    this.mouseDown = false;
    this.lastX = 0;
    this.lastY = 0;
  }

  componentWillReceiveProps( newProps: Props )
  {
    if( newProps.x !== this.props.x || newProps.y !== this.props.y )
    {
      if( !this.mouseDown )
      {
        this.setState( {
          x: newProps.x,
          y: newProps.y
        } );
      }
    }
  }

  componentDidMount()
  {
    document.addEventListener( 'mousemove', this.onMouseMove );
    document.addEventListener( 'mouseup', this.onMouseUp );
  }

  componentWillUnmount()
  {
    document.removeEventListener( 'mousemove', this.onMouseMove );
    document.removeEventListener( 'mouseup', this.onMouseUp );
  }

  render()
  {
    let { width, height, card: { suit, rank, faceDown }, selected } = this.props;
    let { x, y } = this.state;

    return (
      <div
        className={[
          'playing-card',
          selected ? 'selected' : '',
          faceDown ? 'face-down' : 'face-up'
        ].join( ' ' )}
        style={{
          left: x,
          top: y,
          width: width,
          height: height,
        }}
        onContextMenu={this.onContextMenu}
        onMouseDown={this.onMouseDown}
        onDoubleClick={this.onDoubleClick}
      >
        {!faceDown &&
          <>
          <SuitPips
            suit={suit}
            rank={rank}
            cardWidth={width}
            cardHeight={height}
          />
          <span
            className="rank-text"
            style={{
              color: suitToColor( suit )
            }}
          >
            {rankToText( rank )}
          </span>
          <span
            className="rank-text-inverse"
            style={{
              color: suitToColor( suit )
            }}
          >
            {rankToText( rank )}
          </span>
          </>}
      </div>
    );
  }

  private onContextMenu = ( e: React.MouseEvent<{}> ) =>
  {
    if( this.props.showContextMenu )
    {
      e.preventDefault();
      e.stopPropagation();

      this.props.onContextMenu( e.pageX, e.pageY );
    }
  }

  private onDoubleClick = ( e: React.MouseEvent<{}> ) =>
  {
    e.preventDefault();
    e.stopPropagation();

    this.props.onDoubleClick();
  }

  private onMouseDown = ( e: React.MouseEvent<HTMLDivElement> ) =>
  {
    if( e.button === 0 )
    {
      this.mouseDown = true;
      this.lastX = e.screenX;
      this.lastY = e.screenY;

      e.stopPropagation();

      this.props.onTouch();
    }
  }

  private onMouseMove = ( e: MouseEvent ) =>
  {
    if( this.mouseDown )
    {
      let xDiff = e.screenX - this.lastX;
      let yDiff = e.screenY - this.lastY;

      this.setState( ( { x, y } ) => ( { x: x + xDiff, y: y + yDiff } ) );

      e.stopPropagation();

      this.lastX = e.screenX;
      this.lastY = e.screenY;
    }
  }

  private onMouseUp = ( e: MouseEvent ) =>
  {
    if( this.mouseDown )
    {
      this.mouseDown = false;

      e.stopPropagation();
      e.cancelBubble = true;

      this.props.onMove( this.state.x, this.state.y );
    }
  }
}
