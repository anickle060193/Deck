import * as React from 'react';

import './styles.css';

const Selection: React.SFC<{
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
}> = ( { x, y, width, height, visible } ) =>
    (
      <div
        className="selection"
        style={{
          left: width < 0 ? x + width : x,
          top: height < 0 ? y + height : y,
          width: Math.abs( width ),
          height: Math.abs( height ),
          display: visible ? '' : 'none'
        }}
      />
    );

export default Selection;
