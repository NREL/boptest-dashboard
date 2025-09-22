import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { useUser } from '../Context/user-context';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import ResultsTable from '../Components/ResultsTable';
import {Modal} from '../Components/Modal';
import {ResultDetails} from '../Components/ResultDetails';
import {ResultFacet} from '../../common/interfaces';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      flex: 1,
      minHeight: 0,
      overflow: 'hidden',
    },
    paper: {
      padding: theme.spacing(0),
      overflow: 'hidden',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      minHeight: 0,
    },
    noResults: {
      padding: theme.spacing(5),
      textAlign: 'center',
      backgroundColor: 'transparent',
    },
    header: {
      padding: theme.spacing(3, 3, 1.5),
    },
    subheader: {
      padding: theme.spacing(0, 3, 2),
      color: theme.palette.text.secondary,
    },
    tableWrapper: {
      flex: 1,
      minHeight: 0,
      display: 'flex',
    },
  })
);

// Configure axios to include credentials with all requests
axios.defaults.withCredentials = true;

export const Dashboard: React.FC = () => {
  const classes = useStyles();
  const { hashedIdentifier, authedId } = useUser();
  const [results, setResults] = useState([]);
  const [buildingFacets, setBuildingFacets] = useState<ResultFacet[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user is logged in

  const updateResults = () => {
    // Only attempt to fetch results if we have authentication
    if (hashedIdentifier && authedId) {
      setError(null);
      console.log('Fetching results for user:', authedId);
      
      axios.get('/api/results/my-results', {
        withCredentials: true, // Include cookies in the request
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

  const updateBuildingFacets = () => {
    axios.get('/api/results/facets', {
      withCredentials: true // Include cookies in the request
    })
    .then(response => {
      setBuildingFacets(response.data);
    })
    .catch(err => {
      console.error('Error fetching result facets:', err);
    });
  };

  // build out simple data fetcher straight in the useEffect for now
  useEffect(() => {
    updateResults();
    updateBuildingFacets();
  }, []);

  // when we get a selected result, show the result modal
  useEffect(() => {
    if (selectedResult !== null) {
      setShowResultModal(true);
    }
  }, [selectedResult]);

  const handleChange = (result: any) => {
    setSelectedResult(result);
  };

  const closeModal = () => setShowResultModal(false);

  // Handle toggle change

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h5" className={classes.header}>
          My Results
        </Typography>
        <Typography variant="body2" className={classes.subheader}>
          Personal runs captured while you were signed in.
        </Typography>
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
            <div className={classes.tableWrapper}>
              <ResultsTable
                results={results}
                buildingFacets={buildingFacets}
                setSelectedResult={handleChange}
                enableSelection
                enableShareToggle
                showDownloadButton
                onShareToggleComplete={updateResults}
              />
            </div>
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
