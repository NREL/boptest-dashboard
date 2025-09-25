import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {
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
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {useUser} from '../Context/user-context';
import {ContentMobile} from '../Content';
import {AppRoute} from '../enums';
import {ReactComponent as Logo} from '../static/assets/boptest-logo.svg';
import {useLogout} from './useLogout';
import {navLinks} from './navLinks';
import {getAvatarInitials} from './userDisplay';
import {
  MobileHeaderContext,
  MobileHeaderOptions,
} from './MobileHeaderContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default,
    },
    header: {
      position: 'sticky',
      top: 0,
      zIndex: theme.zIndex.appBar,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      padding: theme.spacing(1.5, 2.25, 1.5),
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
      boxShadow: '0 8px 24px rgba(13, 108, 133, 0.2)',
    },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing(1.5),
    },
    headerStart: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1.25),
      minWidth: 0,
      flex: 1,
    },
    headerIconButton: {
      color: theme.palette.primary.contrastText,
      padding: theme.spacing(0.75),
    },
    logo: {
      height: 38,
      width: 'auto',
      flexShrink: 0,
    },
    headerBody: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(0.5),
      minWidth: 0,
    },
    headerTitle: {
      fontWeight: 600,
      lineHeight: 1.2,
    },
    headerSubtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
    },
    statusRow: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(0.75),
      color: 'rgba(255, 255, 255, 0.85)',
    },
    statusText: {
      fontWeight: 500,
      letterSpacing: 0.2,
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
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
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [headerOptions, setHeaderOptions] = useState<MobileHeaderOptions>({});
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

  useEffect(() => {
    const path = location.pathname;
    if (path === AppRoute.Results || path.startsWith(AppRoute.Dashboard)) {
      setHeaderOptions({leftAction: 'none'});
      return;
    }
    setHeaderOptions({leftAction: 'menu'});
  }, [location.pathname]);

  const leftAction = headerOptions.leftAction ?? 'none';

  const handleLeftAction = () => {
    if (leftAction === 'back') {
      if (headerOptions.onBack) {
        headerOptions.onBack();
        return;
      }
      history.goBack();
      return;
    }
    if (leftAction === 'menu') {
      setDrawerOpen(true);
    }
  };

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <div className={classes.headerTop}>
          <div className={classes.headerStart}>
            {leftAction !== 'none' ? (
              <IconButton
                className={classes.headerIconButton}
                onClick={handleLeftAction}
                aria-label={leftAction === 'back' ? 'go back' : 'open navigation'}
              >
                {leftAction === 'back' ? <ArrowBackIcon /> : <MenuIcon />}
              </IconButton>
            ) : null}
            <Logo className={classes.logo} />
          </div>
          <div className={classes.controls}>
            {headerOptions.rightExtras}
            {!headerOptions.hideAuthControl ? renderAuthControl() : null}
          </div>
        </div>
        {(headerOptions.title || headerOptions.subtitle || headerOptions.status) && (
          <div className={classes.headerBody}>
            {headerOptions.title ? (
              <Typography variant="h6" className={classes.headerTitle} noWrap>
                {headerOptions.title}
              </Typography>
            ) : null}
            {headerOptions.subtitle ? (
              <Typography variant="body2" className={classes.headerSubtitle} noWrap>
                {headerOptions.subtitle}
              </Typography>
            ) : null}
            {headerOptions.status ? (
              <div className={classes.statusRow}>
                {headerOptions.status.icon || null}
                <Typography variant="body2" className={classes.statusText} noWrap>
                  {headerOptions.status.label}
                </Typography>
              </div>
            ) : null}
          </div>
        )}
      </header>

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
        <MobileHeaderContext.Provider
          value={{
            options: headerOptions,
            setOptions: setHeaderOptions,
            reset: () => setHeaderOptions({}),
          }}
        >
          <ContentMobile />
        </MobileHeaderContext.Provider>
      </main>
    </div>
  );
};
