import React from 'react';
import {Route, Switch} from 'react-router-dom';

import {Account} from './Pages/Account';
import {Docs} from './Pages/Docs';
import {Home} from './Pages/Home';

import './content.css';

type ContentProps = {
  path: string;
};

export const Content: React.FC<ContentProps> = props => {
  return (
    <div className="content">
      <Switch>
        <Route path="/documentation" component={Docs} />
        <Route path="/Account" component={Account} />
        <Route path="/" component={Home} />
      </Switch>
    </div>
  );
};
