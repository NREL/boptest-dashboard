import React from 'react';
import {Link} from 'react-router-dom';
import {Divider, Button} from '@material-ui/core';
import {createStyles, makeStyles, withStyles} from '@material-ui/core/styles';
import {useUser} from '../Context/user-context';
import axios from 'axios';

const useStyles = makeStyles(() =>
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
      alignItems: 'center',
    },
    link: {
      color: 'white',
      textDecoration: 'none',
    },
  })
);

const ColorButton = withStyles(() => ({
  root: {
    color: 'white',
    borderColor: 'white',
  },
}))(Button);

export const AuthInfo: React.FC = () => {
  const classes = useStyles();

  const { displayName, setDisplayName, hashedIdentifier, loading, refreshAuthStatus } = useUser();
  console.log('AuthInfo component - User context:', { displayName, hashedIdentifier, loading });
  
  // Check if hashedIdentifier exists and is not empty
  const loggedIn = Boolean(hashedIdentifier && hashedIdentifier.length > 0);

  // No longer need the debug refresh button
  const isDev = false;
  
  const logoutEndpoint = '/api/auth/logout';

  // Helper function to delete a cookie
  const deleteCookie = (name: string) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    console.log(`Cookie ${name} deleted`);
  };

  function logOut() {
    // Delete all auth cookies manually
    deleteCookie('auth_status');
    deleteCookie('auth_user');
    deleteCookie('connect.sid');
    deleteCookie('boptest-session');
    
    axios
      .post(logoutEndpoint)
      .then(() => {
        console.log('Server logout successful');
      })
      .catch(err => {
        console.log('Server logout failed:', err);
      })
      .finally(() => {
        // Always clear local state and reload
        setDisplayName('');
        // Hard redirect to home page with cache busting parameter
        window.location.href = '/?logged_out=' + new Date().getTime();
      });
  }

  return (
    <div>
      {loading ? (
        <div className={classes.lineItem}>
          <ColorButton variant="outlined" disabled>Loading...</ColorButton>
        </div>
      ) : loggedIn ? (
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
            <ColorButton variant="outlined">{displayName || 'Dashboard'}</ColorButton>
          </Link>
          {isDev && (
            <>
              <Divider
                orientation="vertical"
                flexItem
                variant="middle"
                className={classes.divider}
              />
              <ColorButton variant="outlined" onClick={refreshAuthStatus}>
                Refresh Auth
              </ColorButton>
            </>
          )}
        </div>
      ) : (
        <div className={classes.lineItem}>
          <Link to={'/login'} className={classes.link}>
            <ColorButton variant="outlined">Sign In</ColorButton>
          </Link>
          {isDev && (
            <>
              <Divider
                orientation="vertical"
                flexItem
                variant="middle"
                className={classes.divider}
              />
              <ColorButton variant="outlined" onClick={refreshAuthStatus}>
                Refresh Auth
              </ColorButton>
            </>
          )}
        </div>
      )}
    </div>
  );
};
