import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {createStyles, makeStyles, ThemeProvider} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CssBaseline from '@material-ui/core/CssBaseline';

import {AppRoute} from './enums';
import {DesktopMainLayout} from './NavBar/DesktopMainLayout';
import {MobileMainLayout} from './NavBar/MobileMainLayout';
import {Login} from './Pages/Auth/Login';
import {Confirm} from './Pages/Auth/Confirm';
import {ConfirmPassword} from './Pages/Auth/ConfirmPassword';
import {ForgotPassword} from './Pages/Auth/ForgotPassword';
import {Signup} from './Pages/Auth/Signup';
import {UserProvider} from './Context/user-context';
import theme from './theme';

const useStyles = makeStyles(() =>
  createStyles({
    pageLayout: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    },
  })
);

export const Layout: React.FC = () => {
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
                {isMobile ? <MobileMainLayout /> : <DesktopMainLayout />}
              </Route>
            </Switch>
          </div>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
};
