import React, {useState} from 'react';
import {BrowserRouter} from 'react-router-dom';

import {MiniDrawer} from './NavBar/MiniDrawer';
import {Title} from './enums';

import './layout.css';

export const Layout: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="page-layout">
        <MiniDrawer />
      </div>
    </BrowserRouter>
  );
};
