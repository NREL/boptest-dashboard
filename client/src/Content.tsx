import React from 'react';
import {Route, Switch} from 'react-router-dom';

import {About} from './Pages/About';
import {Account} from './Pages/Account';
import {Docs} from './Pages/Docs';
import {Home} from './Pages/Home';

import './content.css';

export const Content: React.FC = () => {
  return (
    <div className="content">
      <Switch>
        <Route path="/documentation" component={Docs} />
        <Route path="/account" component={Account} />
        <Route path="/about" component={About} />
        <Route path="/" component={Home} />
      </Switch>
    </div>
  );
};
