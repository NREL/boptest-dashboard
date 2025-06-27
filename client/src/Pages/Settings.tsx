import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Paper,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {useUser} from '../Context/user-context';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import RefreshIcon from '@material-ui/icons/Refresh';

const Alert = props => <MuiAlert elevation={6} variant="filled" {...props} />;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    paper: {
      padding: theme.spacing(3),
      width: '100%',
      maxWidth: 800,
      margin: '0 auto',
    },
    bold: {
      fontWeight: 'inherit',
    },
    fieldContainer: {
      display: 'flex',
      margin: '0 64px 0 0',
      justifyContent: 'space-between',
    },
    field: {
      flexGrow: 2,
    },
    validatedField: {
      width: '100%',
      margin: 'auto',
    },
    passwordField: {
      flexGrow: 2,
      width: '69.25%',
      margin: '0 64px 0 0',
      padding: '0 0 16px 0',
    },
    confirmPasswordField: {
      flexGrow: 2,
      width: '100%',
    },
    applyButton: {
      flexGrow: 1,
    },
    item: {
      padding: '32px 0 0 0',
      fontWeight: 'inherit',
    },
    subItem: {
      padding: '16px 0 0 0',
    },
    radioRoot: {
      color: 'primary',
      '&$checked': {
        color: 'primary',
      },
      '&&:hover': {
        backgroundColor: 'transparent',
      },
    },
    checked: {},
  })
);

const changePasswordEndpoint = '/api/auth/changePassword';
const changeUserNameEndpoint = '/api/accounts/name';
const changeGlobalShareSettingsEndpoint = '/api/accounts/global-share';

// Function to generate a quirky display name
const generateQuirkyName = (): string => {
  const adjectives = [
    'Amazing', 'Brave', 'Clever', 'Dazzling', 'Energetic', 'Fantastic', 'Gentle', 
    'Happy', 'Incredible', 'Jolly', 'Kind', 'Lively', 'Magical', 'Noble', 
    'Optimistic', 'Powerful', 'Quirky', 'Remarkable', 'Smart', 'Talented', 
    'Unique', 'Vibrant', 'Witty', 'Xcellent', 'Youthful', 'Zealous'
  ];
  
  const nouns = [
    'Albatross', 'Beaver', 'Cheetah', 'Dolphin', 'Eagle', 'Fox', 'Giraffe', 
    'Hedgehog', 'Ibis', 'Jaguar', 'Koala', 'Lion', 'Mongoose', 'Narwhal', 
    'Octopus', 'Penguin', 'Quokka', 'Raccoon', 'Sloth', 'Tiger', 'Unicorn', 
    'Vulture', 'Walrus', 'Xerus', 'Yak', 'Zebra'
  ];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective}${randomNoun}${Math.floor(Math.random() * 1000)}`;
};

export const Settings: React.FC = () => {
  const { displayName, hashedIdentifier, authedId, shareAllResults, setDisplayName, refreshAuthStatus, isAdmin } = useUser();

  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [nameError, setNameError] = useState('');
  const [snackMessageOpen, setSnackMessageOpen] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState(['msg', 'success']);
  
  // API Key section states
  const [apiKey, setApiKey] = React.useState('');
  const [apiKeyLoading, setApiKeyLoading] = React.useState(true);
  const [apiKeyError, setApiKeyError] = React.useState('');

  // Initialize username field with current display name
  useEffect(() => {
    if (displayName) {
      setUsername(displayName);
    }
  }, [displayName]);
  
  // Function to fetch API key with retry mechanism
  const fetchApiKey = (retryCount = 0) => {
    setApiKeyLoading(true);
    setApiKeyError('');
    
    axios.get('/api/accounts/key', { 
      withCredentials: true,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
      .then(res => {
        if (res.data && res.data.apiKey) {
          setApiKey(res.data.apiKey);
          setApiKeyLoading(false);
          setApiKeyError('');
        } else {
          throw new Error('Invalid API key response');
        }
      })
      .catch(err => {
        console.error(`Error fetching API key (attempt ${retryCount + 1}):`, err);
        
        // Retry up to 3 times with increasing delay
        if (retryCount < 3) {
          setTimeout(() => {
            fetchApiKey(retryCount + 1);
          }, 1000 * (retryCount + 1)); // 1s, 2s, 3s delay
        } else {
          setApiKeyError('Could not retrieve your API key. Please try again later.');
          setApiKeyLoading(false);
        }
      });
  };
  
  // Fetch API key when component loads
  useEffect(() => {
    if (hashedIdentifier) {
      fetchApiKey();
    }
  }, [hashedIdentifier]);

  const handleUserNameChange = event => {
    setUsername(event.target.value);
    setNameError(''); // Clear error when user types
  };

  const handleSnackMessageClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackMessageOpen(false);
  };

  const getShareResults = () => {
    if (shareAllResults === true) {
      return 'yes';
    } else if (shareAllResults === false) {
      return 'no';
    } else {
      return 'default';
    }
  };

  const setShareResults = event => {
    let shareValue: boolean | null;
    if (event.target.value === 'yes') {
      shareValue = true;
    } else if (event.target.value === 'no') {
      shareValue = false;
    } else {
      shareValue = null;
    }
    
    axios
      .patch(changeGlobalShareSettingsEndpoint, {shareAllResults: shareValue}, { withCredentials: true })
      .then(() => {
        // Update UI state
        if (setShareAllResults) {
          setShareAllResults(shareValue ? 'yes' : (shareValue === false ? 'no' : 'default'));
        }
        
        // Refresh auth status
        refreshAuthStatus();
        
        setSnackMessage(['Share settings updated successfully', 'success']);
        setSnackMessageOpen(true);
      })
      .catch(err => {
        console.error('Error updating share settings:', err);
        setSnackMessage(['Failed to update share settings', 'error']);
        setSnackMessageOpen(true);
      });
  };

  // Generate a new quirky name
  const generateNewQuirkyName = () => {
    const newName = generateQuirkyName();
    setUsername(newName);
  };

  // Check if a display name is already in use
  const checkDisplayNameAvailability = async (name: string): Promise<boolean> => {
    try {
      const response = await axios.get(`/api/accounts/check-display-name?name=${encodeURIComponent(name)}`, 
        { withCredentials: true });
      return response.data.available;
    } catch (err) {
      console.error('Error checking display name availability:', err);
      return false;
    }
  };

  const changeUserName = async () => {
    if (!username || username.trim() === '') {
      setNameError('Display name cannot be empty');
      return;
    }
    
    if (username === displayName) {
      setSnackMessage(['Display name unchanged', 'info']);
      setSnackMessageOpen(true);
      return;
    }
    
    setIsCheckingName(true);
    
    try {
      // Send the update request
      const response = await axios.patch('/api/accounts/display-name', 
        { newDisplayName: username }, 
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.success) {
        // Update the local state
        setDisplayName(username);
        
        // Update auth_user cookie directly as well
        try {
          const cookieStr = document.cookie
            .split('; ')
            .find(row => row.startsWith('auth_user='));
            
          if (cookieStr) {
            const cookieValue = decodeURIComponent(cookieStr.split('=')[1]);
            const userData = JSON.parse(cookieValue);
            
            // Update the display name in the cookie
            userData.displayName = username;
            
            // Set the updated cookie with same expiration time as the original
            document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=${8*60*60}`;
          }
        } catch (e) {
          // Silent fail on cookie update - server-side update still worked
        }
        
        // Refresh the user context to ensure all UI components are updated
        refreshAuthStatus();
        
        // Show success message
        setSnackMessage(['Display name updated successfully', 'success']);
        setSnackMessageOpen(true);
      } else {
        throw new Error('Unexpected server response');
      }
    } catch (err) {
      console.error('Error updating display name:', err.response?.data || err.message || err);
      setSnackMessage(['Failed to update display name', 'error']);
      setSnackMessageOpen(true);
    } finally {
      setIsCheckingName(false);
    }
  };

  // API Key functions
  const apiKeySelector = 'user-api-key';
  
  const copyApiKeyToClipboard = () => {
    const copyText = document.getElementById(apiKeySelector) as HTMLInputElement;
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand('copy');
    
    // Show success notification
    setSnackMessage(['API key copied to clipboard', 'success']);
    setSnackMessageOpen(true);
  };
  
  // Function to generate a new API key
  const generateNewApiKey = () => {
    // Confirm with the user before proceeding
    if (!window.confirm('Are you sure you want to generate a new API key? This will invalidate your current key and any scripts using it will stop working.')) {
      return;
    }
    
    setApiKeyLoading(true);
    setApiKeyError('');
    
    axios.post('/api/accounts/regenerate-key', {}, { 
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.data && res.data.apiKey) {
          setApiKey(res.data.apiKey);
          setSnackMessage(['New API key generated successfully', 'success']);
          setSnackMessageOpen(true);
        } else {
          throw new Error('Invalid API key response');
        }
      })
      .catch(err => {
        const errorMessage = err.response?.data?.details || err.response?.data?.error || err.message || 'Unknown error';
        console.error('Error generating new API key:', err, errorMessage);
        setApiKeyError(`Could not generate a new API key: ${errorMessage}`);
        setSnackMessage(['Failed to generate new API key', 'error']);
        setSnackMessageOpen(true);
      })
      .finally(() => {
        setApiKeyLoading(false);
      });
  };
  
  // We've removed the syncTestData function as it's no longer needed
  
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h5" gutterBottom>
          Account Settings
        </Typography>
        
        <Box fontWeight="fontWeightBold" mt={3}>
          <Typography variant="h6" className={classes.bold}>
            Display Name
          </Typography>
        </Box>
      <Typography variant="subtitle2">
        This will be displayed with your results if you choose to share them.
        Your display name doesn't need to be your real name - feel free to use a fun pseudonym!
      </Typography>
      
      <div style={{ marginTop: '16px' }}>
        <div className={classes.fieldContainer}>
          <TextField
            value={username}
            variant="outlined"
            placeholder="Your display name"
            className={classes.field}
            onChange={event => handleUserNameChange(event)}
            error={!!nameError}
            helperText={nameError}
            disabled={isCheckingName}
          />
          <div style={{ display: 'flex' }}>
            <Tooltip title="Generate a random fun name">
              <span>
                <IconButton 
                  onClick={generateNewQuirkyName}
                  disabled={isCheckingName}
                  style={{ marginRight: '8px' }}
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Button 
              className={classes.applyButton} 
              onClick={changeUserName}
              disabled={isCheckingName}
              variant="contained"
              color="primary"
            >
              {isCheckingName ? 'Updating...' : 'Save Name'}
            </Button>
          </div>
        </div>
      </div>
      
      <Box fontWeight="fontWeightBold" style={{ marginTop: '32px' }}>
        <Typography variant="h6" className={classes.item}>
          Share My Test Results
        </Typography>
      </Box>
      <Typography variant="subtitle2">
        You can choose which results to share or keep private on your dashboard page.
      </Typography>
      <RadioGroup
        value={getShareResults()}
        onChange={event => setShareResults(event)}
        style={{ marginTop: '16px' }}
      >
        <FormControlLabel
          value="default"
          control={
            <Radio
              classes={{
                root: classes.radioRoot,
                checked: classes.checked,
              }}
            />
          }
          label="Default, results are public/private on an individual basis"
        />
        <FormControlLabel
          value="yes"
          control={
            <Radio
              classes={{
                root: classes.radioRoot,
                checked: classes.checked,
              }}
            />
          }
          label="Yes, share all results"
        />
        <FormControlLabel
          value="no"
          control={
            <Radio
              classes={{
                root: classes.radioRoot,
                checked: classes.checked,
              }}
            />
          }
          label="No, keep all results private"
        />
      </RadioGroup>
      
      <Box fontWeight="fontWeightBold" style={{ marginTop: '32px' }}>
        <Typography variant="h6" className={classes.item}>
          API Key
        </Typography>
      </Box>
      <Typography variant="subtitle2">
        This API key can be used to interact with the BOPTEST Dashboard API programmatically.
        Keep it secure - anyone with this key can access the API on your behalf. 
        You can generate a new key at any time, but this will invalidate your current key.
      </Typography>
      
      <div style={{ marginTop: '20px' }}>
        {apiKeyLoading ? (
          <Typography variant="body1">
            Loading your API key...
          </Typography>
        ) : apiKeyError ? (
          <div style={{ 
            display: 'flex',
            width: '100%',
            alignItems: 'center'
          }}>
            <Typography variant="body1" style={{ color: 'red', marginRight: '16px', flexGrow: 1 }}>
              {apiKeyError}
            </Typography>
            <Button
              onClick={() => fetchApiKey(0)}
              variant="contained"
              color="primary"
            >
              Retry
            </Button>
          </div>
        ) : (
          <div style={{ 
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between'
          }}>
            <TextField
              id={apiKeySelector}
              style={{ flexGrow: 1, marginRight: '16px' }}
              value={apiKey}
              variant="outlined"
              inputProps={{ maxLength: 128 }}
              disabled={!apiKey}
            />
            <div style={{ display: 'flex' }}>
              <Button
                onClick={copyApiKeyToClipboard}
                variant="contained"
                color="primary"
                disabled={!apiKey}
                style={{ marginRight: '8px' }}
              >
                Copy to Clipboard
              </Button>
              <Button
                onClick={generateNewApiKey}
                variant="outlined"
                color="primary" 
                disabled={apiKeyLoading}
              >
                {apiKeyLoading ? 'Generating...' : 'Generate New Key'}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <Box fontWeight="fontWeightBold" style={{ marginTop: '32px' }}>
        <Typography variant="h6" className={classes.item}>
          Account Information
        </Typography>
      </Box>
      <Typography variant="body1">
        You're using OAuth authentication through {hashedIdentifier ? 'an external provider' : 'your account'}.
      </Typography>
      <Typography variant="body2" style={{ marginTop: '8px', color: '#666' }}>
        We don't store your personal information like email or name. Your account is securely
        linked to your OAuth provider with a private identifier.
      </Typography>
      
      <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <Typography variant="subtitle2" style={{ fontWeight: 600, marginBottom: '8px' }}>
          Your Hashed Identifier:
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            value={hashedIdentifier}
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              readOnly: true,
              style: { fontFamily: 'monospace', fontSize: '0.9rem' }
            }}
          />
          <Button
            variant="outlined"
            color="primary"
            style={{ marginLeft: '16px', whiteSpace: 'nowrap' }}
            onClick={() => {
              navigator.clipboard.writeText(hashedIdentifier);
              setSnackMessage(['Hashed identifier copied to clipboard', 'success']);
              setSnackMessageOpen(true);
            }}
          >
            Copy
          </Button>
        </div>
        <Typography variant="caption" style={{ display: 'block', marginTop: '8px' }}>
          This is your unique identifier in the system. Administrators may need this to grant you special permissions.
        </Typography>
        
        {isAdmin && (
          <div style={{ 
            marginTop: '16px', 
            padding: '8px 16px', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '4px',
            border: '1px solid #90caf9'
          }}>
            <Typography variant="subtitle2" style={{ fontWeight: 600, color: '#0d47a1' }}>
              Admin Status: You have administrator privileges
            </Typography>
          </div>
        )}
      </div>
      
      <Snackbar
        open={snackMessageOpen}
        autoHideDuration={6000}
        onClose={handleSnackMessageClose}
      >
        <Alert onClose={handleSnackMessageClose} severity={snackMessage[1]}>
          {snackMessage[0]}
        </Alert>
      </Snackbar>
      </Paper>
    </div>
  );
};
