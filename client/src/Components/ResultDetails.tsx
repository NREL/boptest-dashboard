import React from 'react';
import Typography from '@material-ui/core/Typography';
import {Divider} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {KPITable} from './KPITable';
import {ResultInfoTable} from './ResultInfoTable';
import {Result} from '../../common/interfaces';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: 0,
    },
    divider: {
      backgroundColor: 'rgba(0, 0, 0, 0.12)',
      margin: '24px 0',
    },
    blocks: {
      display: 'flex',
    },
  })
);

interface ResultDetailsProps {
  result: Result;
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
