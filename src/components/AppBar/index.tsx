import * as React from 'react';
import { connect } from 'react-redux';

import { createGame, loadGame } from 'store/actions/games';
import { Game } from 'utils/game';

interface PropsFromState
{
  gameLoading: boolean;
  gameCreating: boolean;
  game: Game | null;
}

interface PropsFromDispatch
{
  createGame: typeof createGame;
  loadGame: typeof loadGame;
}

type Props = PropsFromState & PropsFromDispatch;

interface State
{
  gameId: string;
}

class AppBar extends React.Component<Props, State>
{
  constructor( props: Props )
  {
    super( props );

    this.state = {
      gameId: ''
    };
  }

  render()
  {
    let changeGameDisabled = ( this.props.gameCreating || this.props.gameLoading );

    return (
      <nav className="navbar navbar-dark bg-dark">
        <span className="navbar-brand">
          Deck
          {this.props.game && (
            ' - ' + this.props.game.id
          )}
        </span>
        <form
          className="form-inline ml-auto mr-4"
          onSubmit={this.onOpenGame}
        >
          <input
            className="form-control mr-2"
            type="text"
            placeholder="Game ID"
            disabled={changeGameDisabled}
            defaultValue={this.state.gameId}
            onChange={this.onOpenGameIdChange}
          />
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            type="submit"
            disabled={changeGameDisabled || !!this.state.gameId.match( /^\s*$/ )}
          >
            Open Game
          </button>
        </form>

        <button
          className="btn btn-outline-info my-2 my-sm-0"
          type="button"
          disabled={changeGameDisabled}
          onClick={this.props.createGame}
        >
          New Game
        </button>
      </nav>
    );
  }

  private onOpenGameIdChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.setState( { gameId: e.target.value } );
  }

  private onOpenGame = ( e: React.FormEvent<{}> ) =>
  {
    e.preventDefault();

    if( this.state.gameId )
    {
      this.props.loadGame( this.state.gameId );
    }
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    gameLoading: state.games.loading,
    gameCreating: state.games.creating,
    game: state.games.game
  } ),
  {
    createGame,
    loadGame
  }
)( AppBar );
