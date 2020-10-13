import React from 'react';
import {Link} from 'react-router-dom';
import {Divider, Typography} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {useUser} from '../Context/user-context';
import axios from 'axios';

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

export const AuthInfo: React.FC = () => {
  const classes = useStyles();

  const {authedEmail, setAuthedEmail, authedName, setAuthedName} = useUser();

  const loggedIn = authedEmail && authedEmail !== '';

  const logoutEndpoint = '/api/auth/logout';

  function logOut() {
    const data = {
      email: authedEmail,
    };

    axios
      .post(logoutEndpoint, data)
      .then(() => {
        setAuthedEmail('');
        setAuthedName('');
      })
      .catch(err => {
        console.log('unable to log out the user', err);
      });
  }

  return (
    <div>
      {loggedIn ? (
        <div className={classes.lineItem}>
          <Link to={'/'} className={classes.link} onClick={logOut}>
            <Typography variant="h6">Sign Out</Typography>
          </Link>
          <Divider
            orientation="vertical"
            flexItem
            variant="middle"
            className={classes.divider}
          />
          <Link to={'/dashboard'} className={classes.link}>
            <Typography variant="h6">{authedName}</Typography>
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
