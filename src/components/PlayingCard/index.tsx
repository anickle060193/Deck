import * as React from 'react';
import * as Konva from 'konva';
import { Rect, Path, Group } from 'react-konva';

import { Suit, Rank } from 'utils/card';

const CARD_RATIO = 88.9 / 63.50;

const SUIT_TO_COLOR = {
  [ Suit.Spades ]: 'black',
  [ Suit.Clubs ]: 'black',
  [ Suit.Diamonds ]: 'red',
  [ Suit.Hearts ]: 'red'
};

const SUIT_TO_PATH = {
  [ Suit.Spades ]: 'm-26 -14c-31 31-1 53 23 39-4 16-7 17-10 21l26 0c-3-4-6-5-10-21 25 14 51-11 23-39-18-16-25-30-26-32-1 1-10 16-26 32z',
  [ Suit.Clubs ]: 'm-8 -6c-15-7-36 1-31 20 5 18 26 14 34 3-3 21-9 25-12 29l35 0c-4-5-10-8-14-29 8 11 30 15 35-3 5-18-17-28-31-20 14-10 19-40-8-40-26 0-22 31-8 40z',
  [ Suit.Diamonds ]: 'm0 -48.07c-10.45 16.72-21.945 32.395-33.44 48.07 12.54 15.675 24.035 31.35 33.44 48.07 9.405-16.72 20.9-33.44 33.44-48.07-12.54-15.675-24.035-32.395-33.44-48.07z',
  [ Suit.Hearts ]: 'm2 46c-1 0-1-1-1-2-3-8-7-16-14-25-3-4-5-7-12-15-8-10-10-13-13-17-1-3-3-7-3-9 0-3 0-7 0-9 2-8 9-15 18-15 11-1 19 4 24 14l1 2 1-2c1-2 2-4 4-6 5-6 10-8 17-8 3 0 5 0 8 1 3 1 6 3 9 6 7 8 6 19-2 32-2 3-6 7-11 13-5 7-8 10-11 14-7 8-11 16-13 24-1 1-1 2-1 2-1 1-1 1-1 0z'
};

const SuitPip: React.SFC<{
  suit: Suit;
  cardWidth: number
  cardHeight: number;
  x: number;
  y: number;
  scale?: number;
}> = ( { suit, cardWidth, cardHeight, x, y, scale = 1.0 } ) => (
  <Path
    x={x}
    y={y}
    scale={{
      x: ( cardWidth * 0.0025 ) * scale,
      y: ( cardWidth * 0.0025 ) * scale
    }}
    fill={SUIT_TO_COLOR[ suit ]}
    stroke={SUIT_TO_COLOR[ suit ]}
    data={SUIT_TO_PATH[ suit ]}
  />
);

const CENTER = 0.5;

const LEFT = 0.25;
const RIGHT = 1 - LEFT;

const TOP = 0.2;
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

const RANK_TO_LAYOUT = {
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
};

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
    RANK_TO_LAYOUT[ rank ].map( ( [ x, y ], key ) => (
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

interface Props
{
  x: number;
  y: number;
  suit: Suit;
  rank: Rank;
  size: number;
  onMove: ( x: number, y: number ) => void;
}

export default class PlayingCard extends React.Component<Props>
{
  render()
  {
    let { size, suit, rank } = this.props;
    let width = size;
    let height = width * CARD_RATIO;

    let borderWidth = 1;

    return (
      <Group
        x={this.props.x}
        y={this.props.y}
        draggable={true}
        onDragEnd={this.onDragEnd}
      >
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="darkgray"
          cornerRadius={5}
        />
        <Rect
          x={borderWidth}
          y={borderWidth}
          width={width - 2 * borderWidth}
          height={height - 2 * borderWidth}
          fill="white"
          cornerRadius={4}
        />
        <SuitPips
          suit={suit}
          rank={rank}
          cardWidth={width}
          cardHeight={height}
        />
      </Group>
    );
  }

  private onDragEnd = ( e: KonvaTypes.Event<React.MouseEvent<{}>, Konva.Group> ) =>
  {
    let position = e.target.getPosition();
    this.props.onMove( position.x, position.y );
  }
}
