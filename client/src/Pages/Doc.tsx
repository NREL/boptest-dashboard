import React from 'react';
import ReactMarkdown from 'react-markdown';
import {useLocation} from 'react-router-dom';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';

interface LocationState {
  pathname: string;
  buildingType: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '16px',
    },
  })
);

export const Doc: React.FC = () => {
  const classes = useStyles();

  const location = useLocation<LocationState>();
  const {buildingType} = location.state;

  return (
    <div className={classes.root}>
      <Typography variant="h6">{buildingType.name}</Typography>
      <ReactMarkdown source={buildingType.markdown} escapeHtml={false} />
    </div>
  );
};
