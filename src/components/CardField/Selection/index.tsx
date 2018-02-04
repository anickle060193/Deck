import * as React from 'react';
import { Rect } from 'react-konva';

const Selection: React.SFC<{
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
}> = ( { x, y, width, height, visible } ) =>
    (
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        visible={visible}
        fill="#99d3e888"
        stroke="#78d4f588"
      />
    );

export default Selection;
