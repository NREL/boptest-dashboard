import axios from 'axios';
import React, {useEffect, useState} from 'react';
import ResultsTable from '../Components/ResultsTable';
import {Modal} from '../Components/Modal';
import {ResultDetails} from '../Components/ResultDetails';

const endpointResults = '/api/results';
const endpointBuildingTypes = '/api/buildingTypes';

export const Results: React.FC = () => {
  const [results, setResults] = useState([]);
  const [buildingTypes, setBuildingTypes] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  // build out simple data fetcher straight in the useEffect for now
  useEffect(() => {
    axios.get(endpointResults).then(response => {
      setResults(response.data);
    });

    axios.get(endpointBuildingTypes).then(response => {
      setBuildingTypes(response.data);
    });
  }, []);

  // when we get a selected result, show the result modal
  useEffect(() => {
    if (selectedResult != null) {
      setShowResultModal(true);
    }
  }, [selectedResult]);

  const handleChange = result => setSelectedResult(result);

  const closeModal = () => setShowResultModal(false);

  return (
    <div>
      <ResultsTable results={results} buildingTypes={buildingTypes} setSelectedResult={handleChange} />
      {showResultModal && (
        <Modal
          closeModal={closeModal}
          renderProp={<ResultDetails result={selectedResult} />}
        />
      )}
    </div>
  );
};
