import * as React from 'react';
import { connect } from 'react-redux';
import * as qs from 'qs';

import CardField from 'components/CardField';
import { loadLastGame, loadGame } from 'store/actions/games';
import { Game } from 'utils/game';

interface PropsFromState
{
  game: Game | null;
}

interface PropsFromDispatch
{
  loadGame: typeof loadGame;
  loadLastGame: typeof loadLastGame;
}

type Props = PropsFromState & PropsFromDispatch;

class MainContent extends React.Component<Props>
{
  componentDidMount()
  {
    let query = qs.parse( window.location.search, { ignoreQueryPrefix: true } );
    if( 'game' in query )
    {
      let gameId = query.game as string;
      this.props.loadGame( gameId );
    }
    else
    {
      this.props.loadLastGame();
    }
  }

  render()
  {
    return (
      this.props.game && <CardField />
    );
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    game: state.games.game
  } ),
  {
    loadGame,
    loadLastGame
  }
)( MainContent );
