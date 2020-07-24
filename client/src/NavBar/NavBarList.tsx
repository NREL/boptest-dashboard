import React from 'react';

import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import DocsIcon from '@material-ui/icons/LibraryBooks';
import PersonIcon from '@material-ui/icons/Person';
import ChartIcon from '@material-ui/icons/ShowChart';
import {Link} from 'react-router-dom';

import {AppRoute} from '../enums';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
);

export const NavBarList: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
    >
      <ListItem button component={Link} to={AppRoute.Home}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} to={AppRoute.Docs}>
        <ListItemIcon>
          <DocsIcon />
        </ListItemIcon>
        <ListItemText primary="Documentation" />
      </ListItem>
      <ListItem button component={Link} to={AppRoute.Results}>
        <ListItemIcon>
          <ChartIcon />
        </ListItemIcon>
        <ListItemText primary="Test Results" />
      </ListItem>
      <ListItem
        button
        onClick={handleClick}
        component={Link}
        to={AppRoute.Dashboard}
      >
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            button
            className={classes.nested}
            component={Link}
            to={AppRoute.Settings}
          >
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem
            button
            className={classes.nested}
            component={Link}
            to={AppRoute.ApiKey}
          >
            <ListItemText primary="API Key" />
          </ListItem>
        </List>
      </Collapse>
      <ListItem button component={Link} to={AppRoute.About}>
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        <ListItemText primary="About" />
      </ListItem>
    </List>
  );
};
