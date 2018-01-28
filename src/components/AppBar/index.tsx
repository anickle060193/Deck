import * as React from 'react';
import { connect } from 'react-redux';
import { createGame } from 'store/actions/games';

interface PropsFromState
{
  gameLoading: boolean;
  gameCreating: boolean;
}

interface PropsFromDispatch
{
  createGame: typeof createGame;
}

type Props = PropsFromState & PropsFromDispatch;

class AppBar extends React.Component<Props>
{
  render()
  {
    return (
      <nav className="navbar navbar-dark bg-dark justify-content-between">
        <a className="navbar-brand" href="#!">Deck</a>
        <button
          className="btn btn-outline-info my-2 my-sm-0"
          type="button"
          disabled={this.props.gameCreating || this.props.gameLoading}
          onClick={this.props.createGame}
        >
          New Game
        </button>
      </nav>
    );
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    gameLoading: state.games.loading,
    gameCreating: state.games.creating
  } ),
  {
    createGame
  }
)( AppBar );
