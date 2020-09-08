import React from 'react';

interface ResultDetailsProps {
  data: any;
}

// props here are just going to be a result. Need to type it with an interface
// once we have the shared models
export const ResultDetails: React.FC<ResultDetailsProps> = props => {
  // this useEffect will be used to get the testcase signature for ranges if applicable
  // useEffect(() => {}, []);
  return (
    <div>
      <div>You can't do that</div>
      <div>I am here to stay</div>
      <div>{props.data.resultUid}</div>
    </div>
  );
};
