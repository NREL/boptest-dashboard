import React, {useState} from 'react';
import {BrowserRouter} from 'react-router-dom';

import {MiniDrawer} from './NavBar/MiniDrawer';

import './layout.css';

export const Layout: React.FC = () => {
  // title is going to be based on the Content rendered after being selected in
  // the NavBar
  const [title, setTitle] = useState('BOPTest');

  return (
    <BrowserRouter>
      <div className="page-layout">
        <MiniDrawer title={title} />
      </div>
    </BrowserRouter>
  );
};
