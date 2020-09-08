import axios from 'axios';
import React, {useEffect, useState} from 'react';
import ResultsTable from '../Components/ResultsTable';
import {BoptestModal} from '../Components/BoptestModal';
import {ResultDetails} from '../Components/ResultDetails';

const endpoint = '/api/results';

export const Results: React.FC = () => {
  const [results, setResults] = useState([]);

  // build out simple data fetcher straight in the useEffect for now
  useEffect(() => {
    axios.get(endpoint).then(response => {
      setResults(response.data);
    });
  }, []);

  return (
    <div>
      <h1>Results page</h1>
      <BoptestModal
        tableComponent={<ResultsTable results={results} />}
        detailsComponent={<ResultDetails data={null} />}
      />
    </div>
  );
};
