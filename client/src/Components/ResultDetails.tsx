import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {SignatureDetails} from '../../../common/interfaces';
import {KPITable} from './KPITable';
import {ResultInfoTable} from './ResultInfoTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0 16px 0 0',
    },
    idTable: {
      width: '35%',
    },
    divider: {
      backgroundColor: 'black',
    },
    kpiTable: {
      width: '65%',
    },
    kpiTitleLine: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    blocks: {
      display: 'flex',
    },
    link: {
      color: 'white',
      textDecoration: 'none',
    },
  })
);

const getSignatureEndpoint = (resultId: string) => {
  return `/api/results/${resultId}/signature`;
};

interface ResultDetailsProps {
  result: any;
}

// props here are just going to be a result. Need to type it with an interface
// once we have the shared models
export const ResultDetails: React.FC<ResultDetailsProps> = props => {
  const classes = useStyles();
  const [details, setDetails] = useState<SignatureDetails | undefined>(
    undefined
  );

  const [buildingTypeName, setBuildingTypeName] = useState('');

  useEffect(() => {
    // prevent the use effect from firing on render because we'd have an
    // undefined result at times
    if (!props.result) return;

    axios.get(getSignatureEndpoint(props.result.id)).then(response => {
      setDetails(response.data);
      console.log('response details', details);
      console.log('response data', response.data);
    });
  }, [props.result]);

  // make these 2 table functions into their own components
  // also need to fetch the building type name
  // build the Result info table on the left side of the page
  const getResultInfoTable = () => {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  return (
    <div className={classes.root}>
      <Typography variant="subtitle1">TEST CASE</Typography>
      <div className={classes.blocks}>
        <ResultInfoTable result={props.result} />
        <Divider
          className={classes.divider}
          orientation="vertical"
          flexItem
          variant="middle"
        />
        <KPITable result={props.result} />
      </div>
      {/* <Typography variant="subtitle2">TEST CASE</Typography> use for the other headers in the table */}
    </div>
  );
};
