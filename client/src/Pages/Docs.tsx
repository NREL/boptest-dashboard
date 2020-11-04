import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '16px',
    },
  })
);

export const Docs: React.FC = () => {
  const classes = useStyles();
  return <div className={classes.root}>Docs Page</div>;
};
