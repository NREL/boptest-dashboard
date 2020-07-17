import React from 'react';
import {Link} from 'react-router-dom';

import './navbar.css';

type NavBarItemProps = {
  title: string;
};

export const NavBarItem: React.FC<NavBarItemProps> = props => {
  let path = props.title.toLowerCase();
  if (path === 'home' || path === 'boptest') path = '/';

  return (
    <Link className="navbar-row" to={path}>
      {props.title}
    </Link>
  );
};
