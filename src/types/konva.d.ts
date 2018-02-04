import { SyntheticEvent } from "react";

declare global
{
  namespace KonvaTypes
  {
    export interface Event<E extends SyntheticEvent<CT>, CT, T>
    {
      target: T;
      currentTarget: CT;
      evt: E & {
        cancelBubble: boolean;
      };
      type: string;
    }

    export type MouseEvent<T = {}, CT = {}> = KonvaTypes.Event<React.MouseEvent<CT> & {
      offsetX: number;
      offsetY: number;
    }, CT, T>;
  }
}
