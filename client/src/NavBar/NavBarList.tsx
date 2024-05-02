import React, {useEffect} from 'react';
import axios from 'axios';

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
import SettingsIcon from '@material-ui/icons/Settings';
import LockIcon from '@material-ui/icons/Lock';
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

export const NavBarList: React.FC<NavBarListProps> = props => {
  const classes = useStyles();

  const {authedEmail} = useUser();
  const loggedIn = authedEmail && authedEmail !== '';

  const [openDash, setOpenDash] = React.useState(false);
  const [openDocs, setOpenDocs] = React.useState(false);

  const [buildingTypes, setBuildingTypes] = React.useState([]);
  const buildingTypesEndpoint = '/api/buildingTypes';

  useEffect(() => {
    axios.get(buildingTypesEndpoint).then(result => {
      setBuildingTypes(result.data);
    });
  }, []);

  const handleDashClick = () => {
    if (props.drawerOpen) {
      setOpenDash(!openDash);
    } else {
      setOpenDash(true);
    }
  };

  const handleDocsClick = () => {
    console.log('BuildingType DOCS:', buildingTypes);
    if (props.drawerOpen) {
      setOpenDocs(!openDocs);
    } else {
      setOpenDocs(true);
    }
  };

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
            onClick={handleDashClick}
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
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button component={Link} to={AppRoute.ApiKey}>
            <ListItemIcon>
              <LockIcon className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary="API Key" />
          </ListItem>
        </div>
      ) : null}
    </List>
  );
};
