import React, {useState} from 'react';
import {BrowserRouter, Link, Route} from 'react-router-dom';

import {Content} from './Content';
import {Header} from './Header';
import {NavBar} from './NavBar';

import './layout.css';

export const Layout: React.FC = () => {
  // title is going to be based on the Content rendered after being selected in
  // the NavBar
  const [title, setTitle] = useState('BOPTest');
  const [path, setPath] = useState('/');

  return (
    <BrowserRouter>
      <div className="page-layout">
        <NavBar />
        <div className="main-layout">
          <Header title={title} />
          <Content path={path} />
        </div>
      </div>
    </BrowserRouter>
  );
};
