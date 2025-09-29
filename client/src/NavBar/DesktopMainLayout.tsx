import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {createStyles, makeStyles, useTheme, Theme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// FormControlLabel and Switch removed
import {useUser} from '../Context/user-context';
import {ContentDesktop} from '../Content';
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
      width: '100%',
      minHeight: '100vh',
      overflow: 'hidden',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 24px',
      height: 70,
    },
    logo: {
      height: 40,
      marginRight: theme.spacing(2),
    },
    logoContainer: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(1),
      borderRadius: theme.shape.borderRadius,
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
    branding: {
      display: 'flex',
      alignItems: 'center',
      height: '100%',
    },
    navActions: {
      display: 'flex',
      alignItems: 'center',
      height: '100%',
    },
    avatar: {
      width: theme.spacing(4.5),
      height: theme.spacing(4.5),
      backgroundColor: theme.palette.primary.dark,
      marginLeft: theme.spacing(1),
      cursor: 'pointer',
      border: '2px solid white',
      fontSize: '1rem',
      fontWeight: 600,
    },
    userName: {
      marginLeft: theme.spacing(1),
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(1, 2),
      minHeight: 48,
    },
    menuIcon: {
      marginRight: theme.spacing(1.5),
      color: theme.palette.primary.main,
    },
    menuHeader: {
      padding: theme.spacing(1.5, 2),
      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    },
    content: {
      flexGrow: 1,
      padding: 0,
      backgroundColor: theme.palette.background.default,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      overflow: 'hidden',
      height: '100vh',
      paddingTop: 70, // Match the toolbar height
      boxSizing: 'border-box',
    },
    // viewToggle removed
    loginButton: {
      marginLeft: theme.spacing(2),
      borderColor: 'white',
      color: 'white',
      padding: '6px 16px',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
    title: {
      fontWeight: 500,
    },
  })
);

export const DesktopMainLayout: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const {
    displayName,
    hashedIdentifier,
    loading,
  } = useUser();
  const logout = useLogout();

  // Check if user is logged in
  const loggedIn = Boolean(hashedIdentifier && hashedIdentifier.length > 0);
  const navigationLinks = navLinks.filter(link => !link.requiresAuth || loggedIn);

  // No longer needed - toggle removed

  // No longer needed - title and toggle removed

  // Handle user menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  // Handle navigation from menu
  const handleNavigate = (path: string) => {
    handleMenuClose();
    history.push(path);
  };

  // No longer needed - toggle removed

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.branding}>
            <div 
              className={classes.logoContainer} 
              onClick={() => history.push(AppRoute.Results)}
              title="Return to Home"
            >
              <Logo className={classes.logo} />
            </div>
          </div>
          
          <div className={classes.navActions}>
            
            {loggedIn ? (
              <>
                <Box display="flex" alignItems="center">
                  <Avatar 
                    className={classes.avatar} 
                    onClick={handleMenuOpen}
                    aria-controls="user-menu"
                    aria-haspopup="true"
                  >
                    {getAvatarInitials(displayName)}
                  </Avatar>
                </Box>
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem disabled className={classes.menuHeader}>
                    <Typography variant="body2" style={{ fontWeight: 600, color: theme.palette.primary.main }}>
                      {displayName}
                    </Typography>
                  </MenuItem>
                  <Divider />
                  {navigationLinks.map(({Icon, label, path}) => (
                    <MenuItem
                      key={path}
                      onClick={() => handleNavigate(path)}
                      className={classes.menuItem}
                    >
                      <Icon fontSize="small" className={classes.menuIcon} />
                      {label}
                    </MenuItem>
                  ))}
                  <MenuItem 
                    onClick={handleLogout} 
                    className={classes.menuItem}
                  >
                    <ExitToAppIcon fontSize="small" className={classes.menuIcon} />
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              loading ? (
                <Button color="inherit" disabled>Loading...</Button>
              ) : (
                <Button
                  color="inherit"
                  variant="outlined"
                  className={classes.loginButton}
                  onClick={() => history.push(AppRoute.Login)}
                >
                  Sign In
                </Button>
              )
            )}
          </div>
        </Toolbar>
      </AppBar>
      
      <main className={classes.content}>
        <ContentDesktop />
      </main>
    </div>
  );
};
