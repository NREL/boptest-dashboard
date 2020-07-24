import React, {Dispatch, SetStateAction} from 'react';
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
        <Route path={AppRoute.Docs}>
          <Docs />
        </Route>
        <Route path={AppRoute.Account}>
          <Account />
        </Route>
        <Route path={AppRoute.About}>
          <About />
        </Route>
        <Route path={AppRoute.Home}>
          <Home />
        </Route>
      </Switch>
    </div>
  );
};
