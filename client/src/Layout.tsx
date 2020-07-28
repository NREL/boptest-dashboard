import React, {useState} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {MiniDrawer} from './NavBar/MiniDrawer';

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
        <MiniDrawer />
      </div>
    </BrowserRouter>
  );
};
