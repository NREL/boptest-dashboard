import React from 'react';

import {Box} from '@material-ui/core';
import './header.css';

type HeaderProps = {
  title: string;
};

export const Header: React.FC<HeaderProps> = props => {
  return (
    <div className="header">
      <div className="title">{props.title}</div>
      <div className="user-actions">Sign Out Button | username</div>
    </div>
  );
};
