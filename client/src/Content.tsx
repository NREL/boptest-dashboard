import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {createStyles, makeStyles} from '@material-ui/core/styles';

import {About} from './Pages/About';
import {ApiKey} from './Pages/ApiKey';
import {Dashboard} from './Pages/Dashboard';
import {Doc} from './Pages/Doc';
import {Home} from './Pages/Home';
import {Results} from './Pages/Results';
import {Settings} from './Pages/Settings';
import {AppRoute} from './enums';

const useStyles = makeStyles(() =>
  createStyles({
    content: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minHeight: 0,
      overflow: 'hidden',
    },
  })
);
export const Content: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.content}>
      <Switch>
        <Route path={AppRoute.ApiKey}>
          <ApiKey />
        </Route>
        <Route path={AppRoute.Dashboard}>
          <Dashboard />
        </Route>
        <Route path={AppRoute.Settings}>
          <Settings />
        </Route>
        <Route path="/result/:resultUid">
          <Results />
        </Route>
        <Route path={AppRoute.Results}>
          <Results />
        </Route>
      </Switch>
    </div>
  );
};
