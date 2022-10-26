import axios from 'axios';
import React, {useEffect} from 'react';
import {Box, Button, TextField, Typography} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';

const envType = process.env.NODE_ENV;

const useStyles = makeStyles(() =>
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
    syncTestDataButton: {
      justifyContent: 'center',
      padding: '0 16px 0 16px',
      marginLeft: '10px',
      width: '25%',
      backgroundColor: 'rgb(0, 150, 136)',
      color: 'white',
    },
  })
);

const apiKeySelector = 'user-api-key';

const copyApiKeyToClipboard = () => {
  const copyText = document.getElementById(apiKeySelector) as HTMLInputElement;
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand('copy');
};

const syncTestData = apiKey => {
  axios
    .post('/api/setup/db', {apiKey: apiKey})
    .then(res => console.log('Status:', res.status));
};

export const ApiKey: React.FC = () => {
  const classes = useStyles();

  const [apiKey, setApiKey] = React.useState([]);
  const [showSyncTestData, setShowSyncTestData] = React.useState(false);

  useEffect(() => {
    axios.get('/api/accounts/key').then(res => {
      setApiKey(res.data.apiKey);
    });

    if (envType === 'development') {
      setShowSyncTestData(true);
    }
  }, []);

  return (
    <div className={classes.root}>
      <Box fontWeight="fontWeightBold">
        <Typography variant="h6" className={classes.bold}>
          Your API key
        </Typography>
      </Box>
      <div className={classes.apiKeyOps}>
        <TextField
          id={apiKeySelector}
          className={classes.apiKeyText}
          value={apiKey}
          variant="outlined"
          inputProps={{maxLength: 128}}
        />
        <Button
          onClick={() => copyApiKeyToClipboard()}
          className={classes.apiKeyButton}
          variant="contained"
          size="small"
        >
          Copy to Clipboard
        </Button>
        {showSyncTestData && (
          <Button
            onClick={() => syncTestData(apiKey)}
            className={classes.syncTestDataButton}
            variant="contained"
            size="small"
          >
            Sync Test Data
          </Button>
        )}
      </div>
    </div>
  );
};
