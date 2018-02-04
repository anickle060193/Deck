import { SyntheticEvent } from "react";

declare global
{
  namespace KonvaTypes
  {
    export interface Event<ET extends SyntheticEvent<{}>, T>
    {
      target: T;
      evt: ET & {
        cancelBubble: boolean;
      };
      type: string;
    }

    export type MouseEvent<T = {}, ET = {}> = KonvaTypes.Event<React.MouseEvent<ET> & {
      offsetX: number;
      offsetY: number;
    }, T>;
  }
}
