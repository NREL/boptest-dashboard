import React, {useState} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {AppRoute} from './enums';
import {MiniDrawer} from './NavBar/MiniDrawer';
import {Login} from './Pages/Auth/Login';
import {Confirm} from './Pages/Auth/Confirm';
import {Signup} from './Pages/Auth/Signup';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageLayout: {
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      margin: '-8px',
    },
  })
);

export const Layout: React.FC = () => {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.pageLayout}>
        <Switch>
          <Route path={AppRoute.Confirm}>
            <Confirm />
          </Route>
          <Route path={AppRoute.Login}>
            <Login />
          </Route>
          <Route path={AppRoute.Register}>
            <Signup />
          </Route>
          <Route>
            <MiniDrawer />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};
