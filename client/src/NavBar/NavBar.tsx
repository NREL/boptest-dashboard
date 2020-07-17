import React from 'react';

import {NavBarItem} from './NavBarItem';

import './navbar.css';

export const NavBar: React.FC = () => {
  return (
    <div className="navbar-container">
      <div className="navbar">
        <NavBarItem title="BOPTest" />
        <NavBarItem title="Home" />
        <NavBarItem title="Documentation" />
        <NavBarItem title="Rankings" />
        <NavBarItem title="Account" />
        <NavBarItem title="About" />
      </div>
    </div>
  );
};
