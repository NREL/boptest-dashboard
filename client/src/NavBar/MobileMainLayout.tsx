import React, {useCallback, useState} from 'react';
import {useHistory} from 'react-router-dom';
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
import CloseIcon from '@material-ui/icons/Close';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PublicIcon from '@material-ui/icons/Public';
import LockIcon from '@material-ui/icons/Lock';

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

const defaultHeaderOptions: MobileHeaderOptions = {leftAction: 'none'};

const areHeaderOptionsEqual = (
  a: MobileHeaderOptions = defaultHeaderOptions,
  b: MobileHeaderOptions = defaultHeaderOptions
) => {
  if ((a.leftAction ?? 'none') !== (b.leftAction ?? 'none')) {
    return false;
  }
  if (a.onBack !== b.onBack) {
    return false;
  }
  if (a.title !== b.title) {
    return false;
  }
  if (a.subtitle !== b.subtitle) {
    return false;
  }
  if (!!a.hideAuthControl !== !!b.hideAuthControl) {
    return false;
  }
  if (!!a.status !== !!b.status) {
    return false;
  }
  if (a.status && b.status) {
    if (a.status.state !== b.status.state) {
      return false;
    }
    if (a.status.label !== b.status.label) {
      return false;
    }
  }
  if (a.rightExtras !== b.rightExtras) {
    return false;
  }
  return true;
};

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
    logo: {
      height: 38,
      width: 'auto',
      flexShrink: 0,
    },
    secondaryBar: {
      backgroundColor: theme.palette.grey[100],
      color: theme.palette.text.primary,
      padding: theme.spacing(0.85, 0),
      margin: theme.spacing(0, -2.25, -1.25, -2.25),
      borderBottom: `1px solid ${theme.palette.action.hover}`,
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
    },
    secondaryInner: {
      padding: theme.spacing(0, 2.25),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing(1.5),
    },
    secondaryText: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minWidth: 0,
      flex: 1,
    },
    secondaryTitle: {
      fontWeight: 600,
      lineHeight: 1.2,
    },
    secondarySubtitle: {
      color: theme.palette.text.secondary,
    },
    secondaryActions: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
    statusRow: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(0.75),
      color: theme.palette.text.secondary,
    },
    statusText: {
      fontWeight: 500,
      letterSpacing: 0.2,
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1.25),
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
      border: '1px solid rgba(255, 255, 255, 0.45)',
      borderRadius: theme.spacing(0.5),
      textTransform: 'none',
      padding: theme.spacing(0.5, 1.75),
      fontWeight: 600,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        borderColor: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
      },
    },
  })
);

export const MobileMainLayout: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [headerOptions, setHeaderOptions] = useState<MobileHeaderOptions>(defaultHeaderOptions);
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
        <IconButton
          color="inherit"
          onClick={() => setDrawerOpen(true)}
          aria-label="open navigation"
        >
          <Avatar className={classes.avatar}>{getAvatarInitials(displayName)}</Avatar>
        </IconButton>
      );
    }

    return (
      <Button
        className={classes.loginButton}
        onClick={handleAuthClick}
        variant="outlined"
        color="inherit"
      >
        Sign In
      </Button>
    );
  };

  const applyHeaderOptions = useCallback((next: MobileHeaderOptions) => {
    const normalized: MobileHeaderOptions = {
      ...next,
      leftAction: 'none',
    };
    setHeaderOptions(prev =>
      areHeaderOptionsEqual(prev, normalized) ? prev : normalized
    );
  }, []);

  const resetHeaderOptions = useCallback(() => {
    setHeaderOptions(prev =>
      areHeaderOptionsEqual(prev, defaultHeaderOptions) ? prev : defaultHeaderOptions
    );
  }, []);

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <div className={classes.headerTop}>
          <div className={classes.headerStart}>
            <Logo className={classes.logo} />
          </div>
          <div className={classes.controls}>
            {!headerOptions.hideAuthControl ? renderAuthControl() : null}
          </div>
        </div>
        {(headerOptions.title || headerOptions.subtitle || headerOptions.status || headerOptions.rightExtras) ? (
          <div className={classes.secondaryBar}>
            <div className={classes.secondaryInner}>
            <div className={classes.secondaryText}>
              {headerOptions.title ? (
                <Typography variant="subtitle1" className={classes.secondaryTitle} noWrap>
                  {headerOptions.title}
                </Typography>
              ) : null}
              {headerOptions.subtitle ? (
                <Typography variant="body2" className={classes.secondarySubtitle} noWrap>
                  {headerOptions.subtitle}
                </Typography>
              ) : null}
            </div>
            <div className={classes.secondaryActions}>
              {headerOptions.status ? (
                <div className={classes.statusRow}>
                  {headerOptions.status.state === 'public' ? (
                    <PublicIcon fontSize="small" />
                  ) : (
                    <LockIcon fontSize="small" />
                  )}
                  <Typography variant="body2" className={classes.statusText} noWrap>
                    {headerOptions.status.label}
                  </Typography>
                </div>
              ) : null}
              {headerOptions.rightExtras}
            </div>
            </div>
          </div>
        ) : null}
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
            setOptions: applyHeaderOptions,
            reset: resetHeaderOptions,
          }}
        >
          <ContentMobile />
        </MobileHeaderContext.Provider>
      </main>
    </div>
  );
};
