import React from 'react';
import Typography from '@material-ui/core/Typography';
import {Divider, Button} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {KPITable} from './KPITable';
import {ResultInfoTable} from './ResultInfoTable';
import {Result} from '../../common/interfaces';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: 0,
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
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
  const canShare = props.result.isShared === true;

  const copyLinkToClipboard = () => {
    const {origin} = window.location;
    const shareUrl = `${origin}/result/${props.result.uid}`;
    navigator.clipboard.writeText(shareUrl).catch(() => {
      // absorb copy errors silently
    });
  };

  return (
    <div className={classes.root}>
      <div className={classes.headerRow}>
        <Typography variant="subtitle1">TEST CASE</Typography>
        {canShare && (
          <Button size="small" variant="outlined" color="primary" onClick={copyLinkToClipboard}>
            Copy Result Link
          </Button>
        )}
      </div>
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
