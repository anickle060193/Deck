import * as React from 'react';
import { connect } from 'react-redux';

import CardField from 'components/CardField';
import { loadLastGame } from 'store/actions/games';
import { Game } from 'utils/game';

interface PropsFromState
{
  game: Game | null;
}

interface PropsFromDispatch
{
  loadLastGame: typeof loadLastGame;
}

type Props = PropsFromState & PropsFromDispatch;

class MainContent extends React.Component<Props>
{
  componentDidMount()
  {
    this.props.loadLastGame();
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
    loadLastGame
  }
)( MainContent );
