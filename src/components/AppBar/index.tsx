import * as React from 'react';

export default class AppBar extends React.Component
{
  render()
  {
    return (
      <nav className="navbar navbar-dark bg-dark justify-content-between">
        <a className="navbar-brand" href="#!">Navbar</a>
        <button className="btn btn-outline-info my-2 my-sm-0" type="button">New Game</button>
      </nav>
    );
  }
}
