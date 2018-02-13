export interface GameBase
{
  nextCardIndex: number;
}

export interface Game extends GameBase
{
  id: string;
}

export interface GameUpdate extends Partial<GameBase>
{
  id: string;
}
