import axios from 'axios';
import React, {useEffect} from 'react';
import {Box, Button, TextField, Typography} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {useUser} from '../Context/user-context';

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

};

export const ApiKey: React.FC = () => {
  const classes = useStyles();

  const [apiKey, setApiKey] = React.useState('');
  const {csrfToken} = useUser();
  const sessionHeaders = React.useMemo(() => (
    csrfToken ? {'X-CSRF-Token': csrfToken} : {}
  ), [csrfToken]);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [showSyncTestData, setShowSyncTestData] = React.useState(false);

  const syncTestData = (key: string) => {
    axios
      .post('/api/setup/db', {apiKey: key}, {
        withCredentials: true,
        headers: {
          ...sessionHeaders,
        },
      })
      .then(res => console.log('Status:', res.status))
      .catch(err => console.error('Error syncing test data:', err));
  };

  useEffect(() => {
    if (!csrfToken) {
      return;
    }

    setLoading(true);
    setError('');

    axios.get('/api/accounts/key', { withCredentials: true, headers: { ...sessionHeaders } })
      .then(res => {
        setApiKey(res.data.apiKey);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching API key:', err);
        setError('Could not retrieve your API key. Please try again later.');
        setLoading(false);
      });

    if (envType === 'development') {
      setShowSyncTestData(true);
    }
  }, [csrfToken]);

  return (
    <div className={classes.root}>
      <Box fontWeight="fontWeightBold">
        <Typography variant="h6" className={classes.bold}>
          Your API key
        </Typography>
      </Box>
      
      {loading ? (
        <Typography variant="body1" style={{ marginTop: '20px' }}>
          Loading your API key...
        </Typography>
      ) : error ? (
        <Typography variant="body1" style={{ marginTop: '20px', color: 'red' }}>
          {error}
        </Typography>
      ) : (
        <div className={classes.apiKeyOps}>
          <TextField
            id={apiKeySelector}
            className={classes.apiKeyText}
            value={apiKey}
            variant="outlined"
            inputProps={{maxLength: 128}}
            disabled={!apiKey}
          />
          <Button
            onClick={() => copyApiKeyToClipboard()}
            className={classes.apiKeyButton}
            variant="contained"
            size="small"
            disabled={!apiKey}
          >
            Copy to Clipboard
          </Button>
          {showSyncTestData && (
            <Button
              onClick={() => syncTestData(apiKey)}
              className={classes.syncTestDataButton}
              variant="contained"
              size="small"
              disabled={!apiKey}
            >
              Sync Test Data
            </Button>
          )}
        </div>
      )}
      
      <Typography variant="body2" style={{ marginTop: '20px' }}>
        This API key can be used to interact with the BOPTEST Dashboard API programmatically.
        Keep it secure - anyone with this key can access the API on your behalf.
      </Typography>
    </div>
  );
};
