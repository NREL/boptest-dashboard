import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {AppRoute} from './enums';
import {MiniDrawer} from './NavBar/MiniDrawer';
import {Login} from './Pages/Auth/Login';
import {Confirm} from './Pages/Auth/Confirm';
import {ConfirmPassword} from './Pages/Auth/ConfirmPassword';
import {ForgotPassword} from './Pages/Auth/ForgotPassword';
import {Signup} from './Pages/Auth/Signup';
import {UserProvider} from './Context/user-context';

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
    <UserProvider>
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
            <Route path={AppRoute.ForgotPassword}>
              <ForgotPassword />
            </Route>
            <Route path={AppRoute.ConfirmPassword}>
              <ConfirmPassword />
            </Route>
            <Route>
              <MiniDrawer />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
};
