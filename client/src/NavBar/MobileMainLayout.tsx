import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Button,
} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import {useUser} from '../Context/user-context';
import {ContentMobile} from '../Content';
import {AppRoute} from '../enums';
import {ReactComponent as Logo} from '../static/assets/boptest-logo.svg';
import {useLogout} from './useLogout';
import {navLinks} from './navLinks';
import {getAvatarInitials} from './userDisplay';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 1.5),
      minHeight: 64,
    },
    branding: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      cursor: 'pointer',
    },
    logo: {
      height: 28,
      width: 'auto',
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      paddingTop: 64,
    },
    avatar: {
      width: theme.spacing(4.5),
      height: theme.spacing(4.5),
      backgroundColor: theme.palette.primary.dark,
      fontWeight: 600,
      marginLeft: theme.spacing(1),
    },
    drawerPaper: {
      width: 280,
      maxWidth: '85vw',
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(2, 2, 1.5),
    },
    drawerContent: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    navList: {
      flex: 1,
      padding: theme.spacing(0, 0, 1.5),
    },
    navListItem: {
      padding: theme.spacing(1.5, 2),
    },
    drawerFooter: {
      padding: theme.spacing(1.5, 2.5, 2.5),
      borderTop: '1px solid rgba(0, 0, 0, 0.08)',
    },
    userSummary: {
      padding: theme.spacing(2, 2.5, 1.5),
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1.5),
    },
    userMeta: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(0.5),
    },
    loginButton: {
      marginLeft: theme.spacing(1),
    },
  })
);

export const MobileMainLayout: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {displayName, hashedIdentifier, loading} = useUser();
  const logout = useLogout();

  const loggedIn = Boolean(hashedIdentifier && hashedIdentifier.length > 0);
  const availableLinks = navLinks.filter(link => !link.requiresAuth || loggedIn);

  const handleNavigate = (path: string) => {
    history.push(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    setDrawerOpen(false);
    logout();
  };

  const handleAuthClick = () => {
    if (loggedIn) {
      handleNavigate(AppRoute.Settings);
      return;
    }
    history.push(AppRoute.Login);
  };

  const renderAuthControl = () => {
    if (loading) {
      return (
        <Button color="inherit" disabled>
          Loading...
        </Button>
      );
    }

    if (loggedIn) {
      return (
        <Avatar className={classes.avatar} onClick={() => setDrawerOpen(true)}>
          {getAvatarInitials(displayName)}
        </Avatar>
      );
    }

    return (
      <Button color="inherit" className={classes.loginButton} onClick={handleAuthClick}>
        Sign In
      </Button>
    );
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)} aria-label="open navigation">
            <MenuIcon />
          </IconButton>
          <div className={classes.branding} onClick={() => handleNavigate(AppRoute.Results)}>
            <Logo className={classes.logo} />
            <Typography variant="subtitle1" component="span">
              BOPTEST
            </Typography>
          </div>
          {renderAuthControl()}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        classes={{paper: classes.drawerPaper}}
      >
        <div className={classes.drawerContent}>
          <div className={classes.drawerHeader}>
            <Typography variant="subtitle1">Navigation</Typography>
            <IconButton onClick={() => setDrawerOpen(false)} aria-label="close navigation">
              <CloseIcon />
            </IconButton>
          </div>
          <Divider />

          {loggedIn ? (
            <div className={classes.userSummary}>
              <Avatar className={classes.avatar}>{getAvatarInitials(displayName)}</Avatar>
              <div className={classes.userMeta}>
                <Typography variant="subtitle1">{displayName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Signed in
                </Typography>
              </div>
            </div>
          ) : null}

          <List className={classes.navList} disablePadding>
            {availableLinks.map(({label, path, Icon}) => (
              <ListItem
                button
                key={path}
                className={classes.navListItem}
                onClick={() => handleNavigate(path)}
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItem>
            ))}
          </List>

          <div className={classes.drawerFooter}>
            {loggedIn ? (
              <Button
                startIcon={<ExitToAppIcon />}
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleAuthClick}
                disabled={loading}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </Drawer>

      <main className={classes.content}>
        <ContentMobile />
      </main>
    </div>
  );
};
