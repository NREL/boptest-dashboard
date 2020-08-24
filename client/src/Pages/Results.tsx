import axios from 'axios';
import React, {useEffect, useState} from 'react';
import ResultsTable from '../Components/ResultsTable';

const endpoint = '/api/results';

export const Results: React.FC = () => {
  const [results, setResults] = useState([]);

  // build out simple data fetcher straight in the useEffect for now
  useEffect(() => {
    axios.get(endpoint).then(response => {
      console.log('response data: ', response.data);
      setResults(response.data);
    });
  }, []);

  return (
    <div>
      <h1>Results page</h1>
      <ResultsTable results={results} />
      {/* <div>
        {results.map((item, index) => (
          <div>{item.uid}</div>
        ))}
      </div> */}
    </div>
  );
};
