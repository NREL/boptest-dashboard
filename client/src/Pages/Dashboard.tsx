import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import { useUser } from '../Context/user-context';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import DashboardResultsTable from '../Components/DashboardResultsTable';
import {Modal} from '../Components/Modal';
import {ResultDetails} from '../Components/ResultDetails';
import MainTableHeader from '../Components/MainTableHeader';
import { AppRoute } from '../enums';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(0),
      overflow: 'hidden',
    },
    noResults: {
      padding: theme.spacing(5),
      textAlign: 'center',
      backgroundColor: 'transparent',
    },
  })
);

// Configure axios to include credentials with all requests
axios.defaults.withCredentials = true;

export const Dashboard: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { hashedIdentifier, authedId } = useUser();
  const [results, setResults] = useState([]);
  const [buildingTypes, setBuildingTypes] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMyResults, setViewMyResults] = useState(true);
  
  // Check if user is logged in
  const isLoggedIn = Boolean(hashedIdentifier && hashedIdentifier.length > 0);

  const updateResults = () => {
    // Only attempt to fetch results if we have authentication
    if (hashedIdentifier && authedId) {
      setError(null);
      console.log('Fetching results for user:', authedId);
      
      axios.get('/api/results/my-results', {
        withCredentials: true, // Include cookies in the request
        headers: {
          'X-User-ID': authedId, // Add user ID in header as backup
        }
      })
      .then(response => {
        console.log('Results received:', response.data.length);
        setResults(response.data);
      })
      .catch(err => {
        console.error('Error fetching results:', err);
        setError('Unable to load your results. Please try refreshing the page.');
        setResults([]);
      });
    } else {
      console.warn('No authenticated user, cannot fetch results');
      setError('You must be logged in to view your results.');
      setResults([]);
    }
  };

  const updateBuildingTypes = () => {
    axios.get('/api/buildingTypes', {
      withCredentials: true // Include cookies in the request
    })
    .then(response => {
      setBuildingTypes(response.data);
    })
    .catch(err => {
      console.error('Error fetching building types:', err);
    });
  };

  // build out simple data fetcher straight in the useEffect for now
  useEffect(() => {
    updateResults();
    updateBuildingTypes();
  }, []);

  // when we get a selected result, show the result modal
  useEffect(() => {
    if (selectedResult !== null) {
      setShowResultModal(true);
    }
  }, [selectedResult]);

  const handleChange = result => {
    const updatedResult = {uid: result.resultUid, ...result};
    setSelectedResult(updatedResult);
  };

  const closeModal = () => setShowResultModal(false);

  // Handle toggle change
  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setViewMyResults(newValue);
    
    // Navigate to appropriate page
    if (!newValue) {
      history.push(AppRoute.Results);
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {error ? (
          <Paper elevation={0} className={classes.noResults}>
            <Typography variant="h6" color="error" gutterBottom>
              Authentication Error
            </Typography>
            <Typography variant="body1" paragraph>
              {error}
            </Typography>
            <Button 
              variant="contained"
              color="primary"
              onClick={() => updateResults()} 
            >
              Try Again
            </Button>
          </Paper>
        ) : results.length === 0 ? (
          <Paper elevation={0} className={classes.noResults}>
            <Typography variant="body1">
              You don't have any test results yet.
            </Typography>
          </Paper>
        ) : (
          <>
            <DashboardResultsTable
              results={results}
              buildingTypes={buildingTypes}
              setSelectedResult={handleChange}
              updateResults={updateResults}
              viewMyResults={viewMyResults}
              onToggleChange={handleToggleChange}
              isLoggedIn={isLoggedIn}
            />
            {showResultModal && (
              <Modal
                closeModal={closeModal}
                renderProp={<ResultDetails result={selectedResult} />}
              />
            )}
          </>
        )}
      </Paper>
    </div>
  );
};
