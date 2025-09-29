import React, {ReactNode} from 'react';
import {Route, Switch} from 'react-router-dom';
import {createStyles, makeStyles} from '@material-ui/core/styles';

import {ApiKey} from './Pages/ApiKey';
import {DashboardDesktop, DashboardMobile} from './Pages/Dashboard';
import {ResultsDesktop, ResultsMobile} from './Pages/Results';
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

interface ContentFrameProps {
  children: ReactNode;
}

const ContentFrame: React.FC<ContentFrameProps> = ({children}) => {
  const classes = useStyles();
  return <div className={classes.content}>{children}</div>;
};

export const ContentDesktop: React.FC = () => (
  <ContentFrame>
    <Switch>
      <Route path={AppRoute.ApiKey}>
        <ApiKey />
      </Route>
      <Route path={AppRoute.Dashboard}>
        <DashboardDesktop />
      </Route>
      <Route path={AppRoute.Settings}>
        <Settings />
      </Route>
      <Route path="/result/:resultUid">
        <ResultsDesktop />
      </Route>
      <Route path={AppRoute.Results}>
        <ResultsDesktop />
      </Route>
    </Switch>
  </ContentFrame>
);

export const ContentMobile: React.FC = () => (
  <ContentFrame>
    <Switch>
      <Route path={AppRoute.ApiKey}>
        <ApiKey />
      </Route>
      <Route path={AppRoute.Dashboard}>
        <DashboardMobile />
      </Route>
      <Route path={AppRoute.Settings}>
        <Settings />
      </Route>
      <Route path="/result/:resultUid">
        <ResultsMobile />
      </Route>
      <Route path={AppRoute.Results}>
        <ResultsMobile />
      </Route>
    </Switch>
  </ContentFrame>
);
