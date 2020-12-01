import axios from 'axios';
import React, {useEffect, useState} from 'react';

import DashboardResultsTable from '../Components/DashboardResultsTable';
import {Modal} from '../Components/Modal';
import {ResultDetails} from '../Components/ResultDetails';

import {useUser} from '../Context/user-context';

export const Dashboard: React.FC = () => {
  const [results, setResults] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  const {authedEmail} = useUser();

  // build out simple data fetcher straight in the useEffect for now
  useEffect(() => {
    const endpoint = `/api/results/my-results`;
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

  const handleChange = result => {
    let updatedResult = {uid: result.resultUid, ...result}
    console.log('handleChange', updatedResult);
    setSelectedResult(updatedResult);
  };

  const closeModal = () => setShowResultModal(false);

  return (
    <div>
      {/* filters components placeholder */}
      <DashboardResultsTable
        results={results}
        setSelectedResult={handleChange}
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
