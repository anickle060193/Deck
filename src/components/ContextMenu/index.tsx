import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './styles.css';

type MenuItemClickCallback = () => void;

interface Props
{
  open: boolean;
  x: number;
  y: number;
  actions: { label: string, onClick: MenuItemClickCallback }[];
  onClose: () => void;
}

export default class ContextMenu extends React.Component<Props>
{
  contextMenuRef: HTMLElement | null = null;

  componentDidMount()
  {
    document.addEventListener( 'mousedown', this.onCloseContextMenu );
  }

  componentWillUnmount()
  {
    document.removeEventListener( 'mousedown', this.onCloseContextMenu );
  }

  render()
  {
    return ReactDOM.createPortal( (
      <div
        className="context-menu"
        style={{
          left: this.props.x,
          top: this.props.y,
          display: this.props.open ? '' : 'none',
          zIndex: 1100
        }}
        ref={( ref ) => this.contextMenuRef = ref}
      >
        <ul>
          {this.props.actions.map( ( { label, onClick }, i ) => (
            <li
              key={i}
              tabIndex={i + 1}
              onClick={( e ) => this.onMenuItemClick( e, onClick )}
            >
              {label}
            </li>
          ) )}
        </ul>
      </div>
    ), document.body );
  }

  private onCloseContextMenu = ( e: MouseEvent ) =>
  {
    if( this.props.open && this.contextMenuRef && !this.contextMenuRef.contains( e.target as HTMLElement ) )
    {
      e.preventDefault();
      e.stopPropagation();

      this.props.onClose();
    }
  }

  private onMenuItemClick = ( e: React.MouseEvent<{}>, onClick: MenuItemClickCallback ) =>
  {
    e.preventDefault();
    e.stopPropagation();

    this.props.onClose();
    onClick();
  }
}
