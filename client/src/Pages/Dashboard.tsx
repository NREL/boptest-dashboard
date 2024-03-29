import axios from 'axios';
import React, {useEffect, useState} from 'react';

import DashboardResultsTable from '../Components/DashboardResultsTable';
import {Modal} from '../Components/Modal';
import {ResultDetails} from '../Components/ResultDetails';

export const Dashboard: React.FC = () => {
  const [results, setResults] = useState([]);
  const [buildingTypes, setBuildingTypes] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  const updateResults = () => {
    axios.get('/api/results/my-results').then(response => {
      setResults(response.data);
    });
  };

  const updateBuildingTypes = () => {
    axios.get('/api/buildingTypes').then(response => {
      setBuildingTypes(response.data);
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
    </div>
  );
};
