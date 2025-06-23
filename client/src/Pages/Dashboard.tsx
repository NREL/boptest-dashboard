import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { useUser } from '../Context/user-context';

import DashboardResultsTable from '../Components/DashboardResultsTable';
import {Modal} from '../Components/Modal';
import {ResultDetails} from '../Components/ResultDetails';

// Configure axios to include credentials with all requests
axios.defaults.withCredentials = true;

export const Dashboard: React.FC = () => {
  const { hashedIdentifier, authedId } = useUser();
  const [results, setResults] = useState([]);
  const [buildingTypes, setBuildingTypes] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div>
      {error ? (
        <div style={{ 
          padding: '2rem', 
          margin: '2rem auto', 
          maxWidth: '600px', 
          textAlign: 'center',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Authentication Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => updateResults()} 
            style={{
              padding: '8px 16px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <DashboardResultsTable
            results={results}
            buildingTypes={buildingTypes}
            setSelectedResult={handleChange}
            updateResults={updateResults}
          />
          {showResultModal && (
            <Modal
              closeModal={closeModal}
              renderProp={<ResultDetails result={selectedResult} />}
            />
          )}
        </>
      )}
    </div>
  );
};
