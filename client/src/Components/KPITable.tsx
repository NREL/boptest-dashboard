import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Table, TableBody, TableCell, TableRow} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {SignatureDetails, Result} from '../../common/interfaces';
import {KPIBarChart} from './KPIBarChart';

const numberOfResultsToShowChart = 3;

const useStyles = makeStyles(() =>
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
  result: Result;
}

const getSignatureEndpoint = (resultId: string) => {
  return `/api/results/${resultId}/signature`;
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
                  <Typography variant="body2">
                    Total Energy [kWh/m^2]
                  </Typography>
                </TableCell>
                {/* potentially use a data component here to house value and the chart */}
                <TableCell>{props.result.energy.toFixed(4)}</TableCell>
                {details.numResults >= numberOfResultsToShowChart && (
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
                    Thermal Discomfort [Kh/zone]
                  </Typography>
                </TableCell>
                {/* potentially use a data component here to house value and the chart */}
                <TableCell>{props.result.thermalDiscomfort.toFixed(4)}</TableCell>
                {details.numResults >= numberOfResultsToShowChart && (
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
                  <Typography variant="body2">
                    Total Operations Cost [$ or Euro/m^2]
                  </Typography>
                </TableCell>
                {/* potentially use a data component here to house value and the chart */}
                <TableCell>{props.result.cost.toFixed(2)}</TableCell>
                {details.numResults >= numberOfResultsToShowChart && (
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
                  <Typography variant="body2">
                    Total CO2 emissions [kgCO2/m^2]
                  </Typography>
                </TableCell>
                {/* potentially use a data component here to house value and the chart */}
                <TableCell>{props.result.emissions.toFixed(4)}</TableCell>
                {details.numResults >= numberOfResultsToShowChart && (
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
                  <Typography variant="body2">
                    Indoor Air Quality Discomfort [ppmh/zone]
                  </Typography>
                </TableCell>
                {/* potentially use a data component here to house value and the chart */}
                <TableCell>{props.result.aqDiscomfort.toFixed(4)}</TableCell>
                {details.numResults >= numberOfResultsToShowChart && (
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
                <TableCell>{props.result.compTimeRatio.toFixed(4)}</TableCell>
                {details.numResults >= numberOfResultsToShowChart && (
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
