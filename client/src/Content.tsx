import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {About} from './Pages/About';
import {ApiKey} from './Pages/ApiKey';
import {Dashboard} from './Pages/Dashboard';
import {Doc} from './Pages/Doc';
import {Docs} from './Pages/Docs';
import {Home} from './Pages/Home';
import {Results} from './Pages/Results';
import {Settings} from './Pages/Settings';
import {AppRoute} from './enums';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      height: '100%',
    },
  })
);
export const Content: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.content}>
      <Switch>
        <Route path={AppRoute.About}>
          <About />
        </Route>
        <Route path={AppRoute.ApiKey}>
          <ApiKey />
        </Route>
        <Route path={AppRoute.Dashboard}>
          <Dashboard />
        </Route>
        <Route path={AppRoute.Docs}>
          <Docs />
        </Route>
        <Route path={AppRoute.Doc}>
          <Doc />
        </Route>
        <Route path={AppRoute.Results}>
          <Results />
        </Route>
        <Route path={AppRoute.Settings}>
          <Settings />
        </Route>
        <Route path={AppRoute.Home}>
          <Home />
        </Route>
      </Switch>
    </div>
  );
};
