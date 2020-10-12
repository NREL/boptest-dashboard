import React from 'react';
import {Link} from 'react-router-dom';
import {Divider, Typography} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '16px 0 0 16px',
      width: '60%',
      margin: 'auto',
    },
    divider: {
      backgroundColor: 'white',
    },
    lineItem: {
      display: 'flex',
    },
    link: {
      color: 'white',
      textDecoration: 'none',
    },
  })
);

const loggedIn = false;
const username = 'Chris Berger';

export const AuthInfo: React.FC = () => {
  const classes = useStyles();

  return (
    <div>
      {loggedIn ? (
        <div className={classes.lineItem}>
          <Link to={'/logout'} className={classes.link}>
            <Typography variant="h6">Sign Out</Typography>
          </Link>
          <Divider
            orientation="vertical"
            flexItem
            variant="middle"
            className={classes.divider}
          />
          <Link to={'/dashboard'} className={classes.link}>
            <Typography variant="h6">{username}</Typography>
          </Link>
        </div>
      ) : (
        <div className={classes.lineItem}>
          <Link to={'/login'} className={classes.link}>
            <Typography variant="h6">Sign In</Typography>
          </Link>
          <Divider
            orientation="vertical"
            flexItem
            variant="middle"
            className={classes.divider}
          />
          <Link to={'/register'} className={classes.link}>
            <Typography variant="h6">Register</Typography>
          </Link>
        </div>
      )}
    </div>
  );
};
