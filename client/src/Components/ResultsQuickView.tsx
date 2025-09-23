import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(() =>
  createStyles({
    table: {},
  })
);

function createData(buildingType: string, energyUse: number) {
  return {buildingType, energyUse};
}

const endpoint = '/api/results';

export const ResultsQuickView: React.FC = () => {
  const classes = useStyles();

  const [results, setResults] = useState<
    Array<{dateRun: string; buildingType: {name: string}; energyUse: number}>
  >([]);
  const [rows, setRows] = useState<Array<{buildingType: string; energyUse: number}>>([]);

  // build out simple data fetcher straight in the useEffect for now
  useEffect(() => {
    axios
      .get(endpoint, {params: {limit: 10}})
      .then(response => {
        const payload = response.data as {
          results: Array<{dateRun: string; buildingType: {name: string}; energyUse: number}>;
        };

        const sortedData = [...(payload.results || [])].sort(
          (a, b) =>
            new Date(b.dateRun).getTime() - new Date(a.dateRun).getTime()
        );
        setResults(sortedData);
      })
      .catch(err => {
        console.error('Unable to load quick view results', err);
      });
  }, []);

  // this one fires each time new results are fetched to create our table rows
  useEffect(() => {
    if (!results) return;

    const newRowSet = results.map(result => {
      const buildingName = result.buildingType?.name || result.buildingType?.uid || 'Unknown Building';
      return createData(buildingName, result.energyUse);
    });

    setRows(newRowSet);
  }, [results]);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Building Type</TableCell>
            <TableCell align="right">Total Energy [kWh]</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              <TableCell align="center">{row.buildingType}</TableCell>
              <TableCell align="center">{row.energyUse}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
