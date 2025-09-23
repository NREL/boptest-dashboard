import React from 'react';
import Typography from '@material-ui/core/Typography';
import {Button} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
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
    headerText: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      minWidth: 0,
    },
    subheading: {
      color: 'rgba(0, 0, 0, 0.54)',
    },
    content: {
      flexGrow: 1,
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
        <div className={classes.headerText}>
          <Typography variant="h6" noWrap>
            Testcase: {props.result.buildingTypeName}
          </Typography>
          <Typography variant="body2" className={classes.subheading} noWrap>
            Result ID: {props.result.uid}
          </Typography>
        </div>
        {canShare && (
          <Button size="small" variant="outlined" color="primary" onClick={copyLinkToClipboard}>
            Copy Result Link
          </Button>
        )}
      </div>
      <div className={classes.content}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <ResultInfoTable result={props.result} />
          </Grid>
          <Grid item xs={12} md={7}>
            <KPITable result={props.result} />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
