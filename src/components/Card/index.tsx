import * as React from 'react';
import { Stage, Rect, Layer, Path } from 'react-konva';

const CARD_RATIO = 88.9 / 63.50;

export enum Suit
{
  Spades = 'spades',
  Hearts = 'hearts',
  Clubs = 'clubs',
  Diamonds = 'diamonds'
}

export enum Rank
{
  Ace,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Jack,
  Queen,
  King
}

const SUIT_TO_COLOR = {
  [ Suit.Spades ]: 'black',
  [ Suit.Clubs ]: 'black',
  [ Suit.Diamonds ]: 'red',
  [ Suit.Hearts ]: 'red'
};

const SUIT_TO_PATH = {
  [ Suit.Spades ]: 'M24 36C-7 67 23 89 47 75 43 91 40 92 37 96L63 96C60 92 57 91 53 75 78 89 104 64 76 36 58 20 51 6 50 4 49 5 40 20 24 36z',
  [ Suit.Clubs ]: 'M42 44C27 37 6 45 11 64 16 82 37 78 45 67 42 88 36 92 33 96L68 96C64 91 58 88 54 67 62 78 84 82 89 64 94 46 72 36 58 44 72 34 77 4 50 4 24 4 28 35 42 44Z',
  [ Suit.Diamonds ]: 'M50 4C40 20 29 35 18 50 30 65 41 80 50 96 59 80 70 64 82 50 70 35 59 19 50 4z',
  [ Suit.Hearts ]: 'M52 96C51 96 51 95 51 94 48 86 44 78 37 69 34 65 32 62 25 54 17 44 15 41 12 37 11 34 9 30 9 28 9 25 9 21 9 19 11 11 18 4 27 4 38 3 46 8 51 18L52 20 53 18C54 16 55 14 57 12 62 6 67 4 74 4 77 4 79 4 82 5 85 6 88 8 91 11 98 19 97 30 89 43 87 46 83 50 78 56 73 63 70 66 67 70 60 78 56 86 54 94 53 95 53 96 53 96 52 97 52 97 52 96z'
};

const SuitPip: React.SFC<{
  suit: Suit;
  cardSize: number;
  x: number;
  y: number;
  scale?: number;
}> = ( { suit, cardSize, x, y, scale = 1.0 } ) => (
  <Path
    x={x}
    y={y}
    scale={{
      x: ( cardSize * 0.002 ) * scale,
      y: ( cardSize * 0.002 ) * scale
    }}
    offset={{
      x: 50,
      y: -50
    }}
    fill={SUIT_TO_COLOR[ suit ]}
    stroke={SUIT_TO_COLOR[ suit ]}
    data={SUIT_TO_PATH[ suit ]}
  />
);

const CENTER = 0.5;

const LEFT = 0.25;
const RIGHT = 1 - LEFT;

const TOP = 0.05;
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

const RANK_TO_LAYOUT = {
  [ Rank.Ace ]: [ MC ],
  [ Rank.Two ]: [ TC, BC ],
  [ Rank.Three ]: [ TC, MC, BC ],
  [ Rank.Four ]: [ TL, BL, TR, BR ],
  [ Rank.Five ]: [ MC, TL, BL, TR, BR ],
  [ Rank.Six ]: [ TL, BL, TR, BR, ML, MR ],
  [ Rank.Seven ]: [ TL, BL, TR, BR, ML, MR, [ CENTER, 0.25 ] ],
  [ Rank.Eight ]: [ TL, BL, TR, BR, ML, MR, [ CENTER, 0.25 ], [ CENTER, 0.75 ] ],
  [ Rank.Nine ]: [ TL, BL, TR, BR, MC, [ LEFT, 1 / 3 ], [ LEFT, 2 / 3 ], [ RIGHT, 1 / 3 ], [ RIGHT, 2 / 3 ] ],
  [ Rank.Ten ]: [ TL, BL, TR, BR, [ LEFT, 1 / 3 ], [ LEFT, 2 / 3 ], [ RIGHT, 1 / 3 ], [ RIGHT, 2 / 3 ], [ CENTER, 0.25 ], [ CENTER, 0.75 ] ],
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
  cardSize: number;
}> = ( { suit, rank, cardSize } ) => (
  <>
  {
    RANK_TO_LAYOUT[ rank ].map( ( [ x, y ], key ) => (
      <SuitPip
        key={key}
        x={cardSize * x}
        y={cardSize * y}
        suit={suit}
        cardSize={cardSize}
        scale={RANK_TO_SCALE[ rank ]}
      />
    ) )
  }
  </>
);

interface Props
{
  suit: Suit;
  rank: Rank;
  size: number;
}

export default class Card extends React.Component<Props>
{
  render()
  {
    let { size, suit, rank } = this.props;
    let width = size;
    let height = width * CARD_RATIO;

    let borderWidth = 1;

    return (
      <Stage width={width} height={height}>
        <Layer>
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
          <SuitPips cardSize={size} suit={suit} rank={rank} />
        </Layer>
      </Stage>
    );
  }
}
