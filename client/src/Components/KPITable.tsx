import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Table, TableBody, TableCell, TableRow} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {SignatureDetails} from '../../../common/interfaces';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    kpiTable: {
      width: '65%',
    },
    kpiTitleLine: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  })
);

interface KPITableProps {
  result: any;
}

const getSignatureEndpoint = (resultId: string) => {
  return `/api/results/${resultId}/signature`;
};

const buildChart = () => {
  return <Typography variant="h6">Chart goes here</Typography>;
};

export const KPITable: React.FC<KPITableProps> = props => {
  const classes = useStyles();
  const [details, setDetails] = useState<SignatureDetails | undefined>(
    undefined
  );

  // propulate the signature details
  useEffect(() => {
    // prevent the use effect from firing on render if we don't have a result
    if (!props.result) return;

    axios.get(getSignatureEndpoint(props.result.id)).then(response => {
      setDetails(response.data);
      console.log('response details', details);
      console.log('response data', response.data);
    });
  }, [props.result]);

  return (
    <>
      {details && (
        <div className={classes.kpiTable}>
          <div className={classes.kpiTitleLine}>
            <Typography variant="subtitle1">
              KEY PERFORMANCE INDICATORS (KPI)
            </Typography>
            <Typography variant="subtitle2">
              TEST CASE SAMPLE SIZE: {details.numResults}
            </Typography>
          </div>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Energy [kWh]</Typography>
                </TableCell>
                {/* potentially use a data component here to house value and the chart */}
                <TableCell>{props.result.energy}</TableCell>
                {details.numResults > 3 && (
                  <TableCell>{buildChart()}</TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Thermal Discomfort [k-h]</Typography>
                </TableCell>
                {/* potentially use a data component here to house value and the chart */}
                <TableCell>{props.result.thermalDiscomfort}</TableCell>
                {details.numResults > 3 && (
                  <TableCell>{buildChart()}</TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Cost [USD]</Typography>
                </TableCell>
                {/* potentially use a data component here to house value and the chart */}
                <TableCell>{props.result.cost}</TableCell>
                {details.numResults > 3 && (
                  <TableCell>{buildChart()}</TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Emissions [kgCO2]</Typography>
                </TableCell>
                {/* potentially use a data component here to house value and the chart */}
                <TableCell>{props.result.emissions}</TableCell>
                {details.numResults > 3 && (
                  <TableCell>{buildChart()}</TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">IAQ [ppmh]</Typography>
                </TableCell>
                {/* potentially use a data component here to house value and the chart */}
                <TableCell>{props.result.aqDiscomfort}</TableCell>
                {details.numResults > 3 && (
                  <TableCell>{buildChart()}</TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Time Ratio</Typography>
                </TableCell>
                {/* potentially use a data component here to house value and the chart */}
                <TableCell>{props.result.compTimeRatio}</TableCell>
                {details.numResults > 3 && (
                  <TableCell>{buildChart()}</TableCell>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};
