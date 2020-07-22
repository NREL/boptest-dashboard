import React from 'react';
import {Route, Switch} from 'react-router-dom';

import {About} from './Pages/About';
import {Account} from './Pages/Account';
import {Docs} from './Pages/Docs';
import {Home} from './Pages/Home';
import {AppRoute} from './enums';

import './content.css';

export const Content: React.FC = () => {
  return (
    <div className="content">
      <Switch>
        <Route path={AppRoute.Docs} component={Docs} />
        <Route path={AppRoute.Account} component={Account} />
        <Route path={AppRoute.About} component={About} />
        <Route path={AppRoute.Home} component={Home} />
      </Switch>
    </div>
  );
};
