import { SyntheticEvent } from "react";

declare global
{
  namespace KonvaTypes
  {
    export interface Event<ET extends SyntheticEvent<{}>, T>
    {
      target: T;
      evt: ET;
      type: string;
    }
  }
}
