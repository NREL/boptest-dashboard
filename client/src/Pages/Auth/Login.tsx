import React, { useEffect } from 'react';
import { Typography, Link as MuiLink, Divider } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useUser } from './../../Context/user-context';
import { useHistory, useLocation } from 'react-router-dom';

// Icons for OAuth buttons
import GitHubIcon from '@material-ui/icons/GitHub';
import LockIcon from '@material-ui/icons/Lock';
import SecurityIcon from '@material-ui/icons/Security';

const Alert = props => <MuiAlert elevation={6} variant="filled" {...props} />;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    },
    paper: {
      padding: '2em',
      width: '90%',
      maxWidth: '400px',
      borderRadius: '8px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: '120px',
      marginBottom: '1.5em',
    },
    title: {
      marginBottom: '0.5em',
      fontWeight: 600,
      textAlign: 'center',
      color: '#333',
    },
    subtitle: {
      marginBottom: '1.5em',
      textAlign: 'center',
      color: '#666',
    },
    divider: {
      width: '50px',
      margin: '10px 0 20px',
      backgroundColor: theme.palette.primary.main,
      height: '2px',
    },
    oauthSection: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      marginTop: '1em',
    },
    oauthButton: {
      margin: '8px 0',
      padding: '12px',
      textTransform: 'none',
      fontWeight: 500,
      borderRadius: '4px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.15)',
        transform: 'translateY(-2px)',
      },
    },
    googleButton: {
      backgroundColor: '#ffffff',
      color: '#757575',
      border: '1px solid #eaeaea',
      '&:hover': {
        backgroundColor: '#f8f8f8',
      },
    },
    githubButton: {
      backgroundColor: '#24292e',
      color: 'white',
      '&:hover': {
        backgroundColor: '#3a3a3a',
      },
    },
    oauthIcon: {
      marginRight: '12px',
    },
    privacyInfo: {
      marginTop: '2em',
      fontSize: '0.8em',
      textAlign: 'center',
      color: '#888',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    securityIcon: {
      fontSize: '16px',
      marginRight: '6px',
      color: theme.palette.primary.main,
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      marginTop: '1em',
      color: '#666',
    },
  })
);

export const Login: React.FC = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = React.useState(false);
  const [snackMessageOpen, setSnackMessageOpen] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState('');

  const {setDisplayName} = useUser();

  const handleSnackMessageClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackMessageOpen(false);
  };

  useEffect(() => {
    // Check if user came from a redirect
    const query = new URLSearchParams(window.location.search);
    
    // Handle login success
    if (query.get('login') === 'success') {
      setIsLoading(true);
      // Give time for the authentication to be processed
      setTimeout(() => {
        setIsLoading(false);
        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        // Redirect to home page after successful login
        window.location.href = '/';
      }, 1000);
    }
    
    // Handle login errors
    if (query.get('error')) {
      const errorMessage = query.get('error');
      setSnackMessage(errorMessage === 'no_user_or_session' 
        ? 'Authentication failed. Please try again.'
        : 'Login error. Please try again.');
      setSnackMessageOpen(true);
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  
  return (
    <div className={classes.root}>
      {isLoading ? (
        <div className={classes.loadingContainer}>
          <CircularProgress color="primary" size={50} />
          <Typography variant="body1" className={classes.loadingText}>
            Completing authentication...
          </Typography>
        </div>
      ) : (
        <Paper className={classes.paper} elevation={3}>
          <div className={classes.container}>
            <img 
              src="/static/assets/boptest-logo.svg" 
              alt="BOPTEST" 
              className={classes.logo} 
            />
            
            <Typography variant="h5" className={classes.title}>
              Welcome to BOPTEST
            </Typography>
            
            <Divider className={classes.divider} />
            
            <Typography variant="subtitle1" className={classes.subtitle}>
              Please sign in to continue
            </Typography>
            
            <div className={classes.oauthSection}>
              <Button
                variant="contained"
                className={`${classes.oauthButton} ${classes.googleButton}`}
                href="/api/auth/google"
                size="large"
                onClick={() => setIsLoading(true)}
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  width="20"
                  height="20"
                  className={classes.oauthIcon}
                />
                Continue with Google
              </Button>
              
              <Button
                variant="contained"
                className={`${classes.oauthButton} ${classes.githubButton}`}
                href="/api/auth/github"
                startIcon={<GitHubIcon />}
                size="large"
                onClick={() => setIsLoading(true)}
              >
                Continue with GitHub
              </Button>
            </div>
            
            <div className={classes.privacyInfo}>
              <SecurityIcon className={classes.securityIcon} />
              <Typography variant="body2">
                We respect your privacy. No personal information is stored.
              </Typography>
            </div>
          </div>
        </Paper>
      )}
      <Snackbar
        open={snackMessageOpen}
        autoHideDuration={6000}
        onClose={handleSnackMessageClose}
      >
        <Alert onClose={handleSnackMessageClose} severity="error">
          {snackMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};