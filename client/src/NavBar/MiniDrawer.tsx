import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import {AuthInfo} from './AuthInfo';
import {Content} from '../Content';
import {AppRoute, Title} from '../enums';
import {NavBarList} from './NavBarList';

import {ReactComponent as Logo} from '../static/assets/boptest-logo.svg';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      width: '100%',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: theme.palette.primary.main,
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {},
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    titlebar: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    titlebarTitle: {
      textAlign: 'center',
    },
    boptestIcon: {
      width: '7%',
    },
    content: {
      flexGrow: 1,
      width: '100%',
    },
  })
);

const getTitleFromPath = (path: string): string => {
  switch (path) {
    case AppRoute.About:
      return Title.About;
    case AppRoute.ApiKey:
      return Title.ApiKey;
    case AppRoute.Dashboard:
      return Title.Dashboard;
    case AppRoute.Docs:
      return Title.Docs;
    case AppRoute.Results:
      return Title.Results;
    case AppRoute.Settings:
      return Title.Settings;
    default:
      'Path not recognized';
  }
};

export const MiniDrawer: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('BOPTest');
  const location = useLocation();

  useEffect(() => {
    setTitle(getTitleFromPath(location.pathname));
  }, [location]);

  const handleDrawerClick = () => {
    setOpen(!open);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerClick}
            edge="start"
            className={`${classes.menuButton} ${open && classes.hide}`}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.titlebar}>
            <div className={classes.boptestIcon}>
              <Logo />
            </div>
            <Typography variant="h6" className={classes.titlebarTitle}>
              {title}
            </Typography>
            <AuthInfo />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={`${classes.drawer} ${open && classes.drawerOpen} ${
          !open && classes.drawerClose
        }`}
        classes={{
          paper: `${open && classes.drawerOpen} ${
            !open && classes.drawerClose
          }`,
        }}
      >
        <div className={classes.toolbar}></div>
        <Divider />
        <NavBarList drawerOpen={open} />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Content />
      </main>
    </div>
  );
};
