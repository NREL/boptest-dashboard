import axios from 'axios';
import React, {useEffect, useState} from 'react';
import ResultsTable from '../Components/ResultsTable';
import {ResultModal} from '../Components/ResultModal';
import {TableWrapper} from '../Components/TableWrapper';

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
      <TableWrapper tableComponent={<ResultsTable results={results} />} />
      {/* 
      <ResultsTable results={results} />
      <ResultModal /> */}
    </div>
  );
};
