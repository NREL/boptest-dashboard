import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Table, TableBody, TableCell, TableRow} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {SignatureDetails} from '../../../common/interfaces';
import {KPIBarChart} from './KPIBarChart';

const numberOfResultsToShowChart = 3;

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
    if (props.result === undefined) return;

    axios.get(getSignatureEndpoint(props.result.uid)).then(response => {
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
            <colgroup>
              <col style={{width: '30%'}} />
              <col style={{width: '10%'}} />
              <col style={{width: '60%'}} />
            </colgroup>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="body2">Energy [kWh]</Typography>
                </TableCell>
                {/* potentially use a data component here to house value and the chart */}
                <TableCell>{props.result.energy}</TableCell>
                {details.numResults > numberOfResultsToShowChart && (
                  <TableCell>
                    <KPIBarChart
                      value={props.result.energy}
                      min={details.energyUse.min}
                      max={details.energyUse.max}
                    />
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body2">
                    Thermal Discomfort [k-h]
                  </Typography>
                </TableCell>
                {/* potentially use a data component here to house value and the chart */}
                <TableCell>{props.result.thermalDiscomfort}</TableCell>
                {details.numResults > numberOfResultsToShowChart && (
                  <TableCell>
                    <KPIBarChart
                      value={props.result.thermalDiscomfort}
                      min={details.thermalDiscomfort.min}
                      max={details.thermalDiscomfort.max}
                    />
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body2">Cost [USD]</Typography>
                </TableCell>
                {/* potentially use a data component here to house value and the chart */}
                <TableCell>{props.result.cost}</TableCell>
                {details.numResults > numberOfResultsToShowChart && (
                  <TableCell>
                    <KPIBarChart
                      value={props.result.cost}
                      min={details.cost.min}
                      max={details.cost.max}
                    />
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body2">Emissions [kgCO2]</Typography>
                </TableCell>
                {/* potentially use a data component here to house value and the chart */}
                <TableCell>{props.result.emissions}</TableCell>
                {details.numResults > numberOfResultsToShowChart && (
                  <TableCell>
                    <KPIBarChart
                      value={props.result.emissions}
                      min={details.emissions.min}
                      max={details.emissions.max}
                    />
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body2">IAQ [ppmh]</Typography>
                </TableCell>
                {/* potentially use a data component here to house value and the chart */}
                <TableCell>{props.result.aqDiscomfort}</TableCell>
                {details.numResults > numberOfResultsToShowChart && (
                  <TableCell>
                    <KPIBarChart
                      value={props.result.aqDiscomfort}
                      min={details.iaq.min}
                      max={details.iaq.max}
                    />
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body2">Time Ratio</Typography>
                </TableCell>
                {/* potentially use a data component here to house value and the chart */}
                <TableCell>{props.result.compTimeRatio}</TableCell>
                {details.numResults > numberOfResultsToShowChart && (
                  <TableCell>
                    <KPIBarChart
                      value={props.result.compTimeRatio}
                      min={details.timeRatio.min}
                      max={details.timeRatio.max}
                    />
                  </TableCell>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};
