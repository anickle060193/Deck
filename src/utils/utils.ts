function rand( min: number, max: number )
{
  return ( Math.floor( Math.random() * ( max - min + 1 ) ) + min );
}

export function shuffle<T>( items: T[] )
{
  for( let i = 0; i < items.length - 2; i++ )
  {
    let j = rand( i, items.length - 1 );
    [ items[ i ], items[ j ] ] = [ items[ j ], items[ i ] ];
  }
  return items;
}

export function compareTo<T>( a: T, b: T )
{
  if( a < b )
  {
    return -1;
  }
  else if( a > b )
  {
    return 1;
  }
  else
  {
    return 0;
  }
}

export function compareByKey<T>( key: keyof T )
{
  return ( a: T, b: T ) => compareTo( a[ key ], b[ key ] );
}
