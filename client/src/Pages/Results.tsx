import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import ResultsTable from '../Components/ResultsTable';
import {Modal} from '../Components/Modal';
import {ResultDetails} from '../Components/ResultDetails';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useUser } from '../Context/user-context';
import { AppRoute } from '../enums';
import {ResultFacet} from '../../common/interfaces';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(0),
      overflow: 'hidden',
    },
  })
);

const endpointResults = '/api/results';
const endpointFacets = '/api/results/facets';

export const Results: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { hashedIdentifier } = useUser();
  const [results, setResults] = useState([]);
  const [buildingFacets, setBuildingFacets] = useState<ResultFacet[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [viewMyResults, setViewMyResults] = useState(false);
  
  // Check if user is logged in
  const isLoggedIn = Boolean(hashedIdentifier && hashedIdentifier.length > 0);

  // build out simple data fetcher straight in the useEffect for now
  useEffect(() => {
    axios.get(endpointResults).then(response => {
      setResults(response.data);
    });

    axios.get(endpointFacets).then(response => {
      setBuildingFacets(response.data);
    });
  }, []);

  // when we get a selected result, show the result modal
  useEffect(() => {
    if (selectedResult !== null) {
      setShowResultModal(true);
    }
  }, [selectedResult]);

  const handleChange = result => setSelectedResult(result);

  const closeModal = () => setShowResultModal(false);
  
  // Handle toggle change
  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setViewMyResults(newValue);
    
    // Navigate to appropriate page
    if (newValue) {
      history.push(AppRoute.Dashboard);
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <ResultsTable
          results={results}
          buildingFacets={buildingFacets}
          setSelectedResult={handleChange}
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
      </Paper>
    </div>
  );
};
