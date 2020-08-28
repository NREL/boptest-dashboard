import React from 'react';
import {Button, TextField, Typography} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '16px 0 0 16px',
      width: '80%',
      margin: 'auto',
    },
    apiKeyOps: {
      display: 'flex',
      padding: '32px 0 0 0',
      width: '80%',
      justifyContent: 'center',
    },
    apiKeyButton: {
      justifyContent: 'center',
      padding: '0 16px 0 16px',
      width: '25%',
      backgroundColor: 'rgb(0, 150, 136)',
      color: 'white',
    },
    apiKeyText: {
      justifyContent: 'center',
      padding: '0 16px 0 16px',
      width: '50%',
    },
  })
);

export const ApiKey: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h6">Your API key</Typography>
      <Typography variant="body1">
        This is a description for the api key, it can get quite long, but that's
        honestly fine here.
      </Typography>
      <div className={classes.apiKeyOps}>
        <Button className={classes.apiKeyButton} variant="contained">
          Generate API Key
        </Button>
        <TextField
          className={classes.apiKeyText}
          value="apikey147912738127y3817y2378kjasdnfkjasdkfnjsakdjfnaksdjk"
          variant="outlined"
          inputProps={{maxLength: 128}}
        />
        <Button
          className={classes.apiKeyButton}
          variant="contained"
          size="small"
        >
          Copy to Clipboard
        </Button>
      </div>
    </div>
  );
};
