import axios from 'axios';
import React, {useEffect} from 'react';
import {Box, Button, TextField, Typography} from '@material-ui/core';
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
    bold: {
      fontWeight: 'inherit',
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

const apiKeySelector: string = 'user-api-key';

const copyApiKeyToClipboard = () => {
  let copyText = document.getElementById(apiKeySelector) as HTMLInputElement;;
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
}

export const ApiKey: React.FC = () => {
  const classes = useStyles();

  const [apiKey, setApiKey] = React.useState([]);

  useEffect(() => {
    axios.get('/api/auth/key').then(res => {
      setApiKey(res.data.apiKey);
    });
  }, []);

  return (
    <div className={classes.root}>
      <Box fontWeight="fontWeightBold">
        <Typography variant="h6" className={classes.bold}>
          Your API key
        </Typography>
      </Box>
      <Typography variant="body1">
        This is a description for the api key, it can get quite long, but that's
        honestly fine here.
      </Typography>
      <div className={classes.apiKeyOps}>
        <TextField
          id={apiKeySelector}
          className={classes.apiKeyText}
          value={apiKey}
          variant="outlined"
          inputProps={{maxLength: 128}}
        />
        <Button
          onClick={() => copyApiKeyToClipboard() }
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
