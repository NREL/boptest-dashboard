import React from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import ChartIcon from '@material-ui/icons/ShowChart';
import {Link} from 'react-router-dom';

import {AppRoute} from '../enums';
import {useUser} from '../Context/user-context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      padding: '0 0 0 32px',
      margin: '0 0 0 40px',
    },
    icon: {
      color: 'black',
    },
  })
);

interface NavBarListProps {
  drawerOpen: boolean;
}

export const NavBarList: React.FC<NavBarListProps> = _props => {
  const classes = useStyles();

  const { hashedIdentifier } = useUser();
  const loggedIn = hashedIdentifier && hashedIdentifier !== '';

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
    >
      <ListItem button component={Link} to={AppRoute.Results}>
        <ListItemIcon>
          <ChartIcon className={classes.icon} />
        </ListItemIcon>
        <ListItemText primary="Shared Results" />
      </ListItem>
      {loggedIn ? (
        <div>
          <ListItem
            button
            component={Link}
            to={AppRoute.Dashboard}
          >
            <ListItemIcon>
              <PersonIcon className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary="My Results" />
          </ListItem>
          <ListItem button component={Link} to={AppRoute.Settings}>
            <ListItemIcon>
              <SettingsIcon className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary="Account Settings" />
          </ListItem>
        </div>
      ) : null}
    </List>
  );
};
