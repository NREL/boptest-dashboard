import React from 'react';
import {Link} from 'react-router-dom';
import {Divider, Typography, Button} from '@material-ui/core';
import {createStyles, makeStyles, Theme, withStyles} from '@material-ui/core/styles';
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
      alignItems: 'center'
    },
    link: {
      color: 'white',
      textDecoration: 'none',
    },
    
  })
);

const ColorButton = withStyles((theme) => ({
  root: {
    color: 'white',
    borderColor: 'white',
  }
}))(Button);

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
            <ColorButton variant="outlined">Sign Out</ColorButton>
          </Link>
          <Divider
            orientation="vertical"
            flexItem
            variant="middle"
            className={classes.divider}
          />
          <Link to={'/dashboard'} className={classes.link}>
            <ColorButton variant="outlined">{authedName}</ColorButton>
          </Link>
        </div>
      ) : (
        <div className={classes.lineItem}>
          <Link to={'/login'} className={classes.link}>
            <ColorButton variant="outlined">Sign In</ColorButton>
          </Link>
          <Divider
            orientation="vertical"
            flexItem
            variant="middle"
            className={classes.divider}
          />
          <Link to={'/register'} className={classes.link}>
            <ColorButton variant="outlined">Register</ColorButton>
          </Link>
        </div>
      )}
    </div>
  );
};
