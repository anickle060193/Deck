import * as React from 'react';
import { connect } from 'react-redux';

import CardField from 'components/CardField';
import { loadLastGame } from 'store/actions/games';

interface PropsFromDispatch
{
  loadLastGame: typeof loadLastGame;
}

type Props = PropsFromDispatch;

class MainContent extends React.Component<Props>
{
  componentDidMount()
  {
    this.props.loadLastGame();
  }

  render()
  {
    return (
      <CardField />
    );
  }
}

export default connect<{}, PropsFromDispatch, {}, RootState>(
  null,
  {
    loadLastGame
  }
)( MainContent );
