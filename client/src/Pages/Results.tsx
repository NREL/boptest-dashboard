import axios from 'axios';
import React, {useEffect, useState} from 'react';
import ResultsTable from '../Components/ResultsTable';
import {Modal} from '../Components/Modal';
import {ResultDetails} from '../Components/ResultDetails';

const endpoint = '/api/results';

export const Results: React.FC = () => {
  const [results, setResults] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  // build out simple data fetcher straight in the useEffect for now
  useEffect(() => {
    axios.get(endpoint).then(response => {
      setResults(response.data);
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
      {/* filters components placeholder */}
      <ResultsTable results={results} setSelectedResult={handleChange} />
      {showResultModal && (
        <Modal
          closeModal={closeModal}
          renderProp={<ResultDetails result={selectedResult} />}
        />
      )}
    </div>
  );
};
