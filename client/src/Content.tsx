import React, {Dispatch, SetStateAction} from 'react';
import {Route, Switch} from 'react-router-dom';

import {About} from './Pages/About';
import {Account} from './Pages/Account';
import {Docs} from './Pages/Docs';
import {Home} from './Pages/Home';
import {AppRoute} from './enums';

import './content.css';

type ContentProps = {
  setTitle: Dispatch<SetStateAction<string>>;
};

export const Content: React.FC<ContentProps> = props => {
  return (
    <div className="content">
      <Switch>
        <Route path={AppRoute.Docs}>
          <Docs setTitle={props.setTitle} />
        </Route>
        <Route path={AppRoute.Account}>
          <Account setTitle={props.setTitle} />
        </Route>
        <Route path={AppRoute.About}>
          <About setTitle={props.setTitle} />
        </Route>
        <Route path={AppRoute.Home}>
          <Home setTitle={props.setTitle} />
        </Route>
      </Switch>
    </div>
  );
};
