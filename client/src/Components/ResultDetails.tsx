import React from 'react';
import Typography from '@material-ui/core/Typography';
import {Divider} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {KPITable} from './KPITable';
import {ResultInfoTable} from './ResultInfoTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0 16px 0 0',
    },
    divider: {
      backgroundColor: 'black',
    },
    blocks: {
      display: 'flex',
    },
  })
);

interface ResultDetailsProps {
  result: any;
}

export const ResultDetails: React.FC<ResultDetailsProps> = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="subtitle1">TEST CASE</Typography>
      <div className={classes.blocks}>
        <ResultInfoTable result={props.result} />
        <Divider
          className={classes.divider}
          orientation="vertical"
          flexItem
          variant="middle"
        />
        <KPITable result={props.result} />
      </div>
    </div>
  );
};
