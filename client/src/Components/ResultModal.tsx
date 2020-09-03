import React, {useEffect} from 'react';
import {Box, Button, TextField, Typography} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

interface ResultModalProps {
  result: any;
}

// props here are just going to be a result. Need to type it with an interface
// once we have the shared models
export const ResultModal: React.FC<ResultModalProps> = props => {
  // this useEffect will be used to get the testcase signature for ranges if applicable
  // useEffect(() => {}, []);
  return (
    <div>
      <div>You can't do that</div>
      <div>I am here to stay</div>
      <div>{props.result.resultUid}</div>
    </div>
  );
};
