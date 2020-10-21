import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Table, TableBody, TableCell, TableRow} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {SignatureDetails} from '../../../common/interfaces';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    idTable: {
      width: '35%',
    },
    sectionHeader: {
      padding: '16px 0 0 0',
    },
    grayed: {
      backgroundColor: 'rgb(236, 239, 240)',
    },
  })
);

interface ResultInfoTableProps {
  result: any;
}

const getSignatureEndpoint = (resultId: string) => {
  return `/api/results/${resultId}/signature`;
};

export const ResultInfoTable: React.FC<ResultInfoTableProps> = props => {
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
    <div className={classes.idTable}>
      <Typography variant="subtitle2" className={classes.sectionHeader}>
        BUILDING TYPE
      </Typography>
      <Table size="small">
        <TableBody>
          <TableRow className={classes.grayed}>
            <TableCell>
              <Typography variant="body2">
                Residential multi-zone hydronic
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Typography variant="subtitle2" className={classes.sectionHeader}>
        PARAMETERS
      </Typography>
      <Table size="small">
        <TableBody>
          <TableRow className={classes.grayed}>
            <TableCell>
              <Typography variant="body2">Simulation Time</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                {props.result.simulationTime}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body2">Price Scenario</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                {props.result.priceScenario}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow className={classes.grayed}>
            <TableCell>
              <Typography variant="body2">Uncertainty Distribution</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                {props.result.uncertaintyDistribution}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Typography variant="subtitle2" className={classes.sectionHeader}>
        GENERAL
      </Typography>
      <Table size="small">
        <TableBody>
          <TableRow className={classes.grayed}>
            <TableCell>
              <Typography variant="body2">Identifier</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">{props.result.resultUid}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body2">Simulation Date</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">{props.result.dateRun}</Typography>
            </TableCell>
          </TableRow>
          <TableRow className={classes.grayed}>
            <TableCell>
              <Typography variant="body2">Contact</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">chris.berger@devetry.com</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {props.result.controllerProperties &&
        props.result.controllerProperties.length != 0 && (
          <>
            <Typography variant="subtitle2" className={classes.sectionHeader}>
              CONTROLLER PROPERTIES
            </Typography>
            <Table size="small">
              <TableBody>
                <TableRow className={classes.grayed}>
                  <TableCell>
                    <Typography variant="body2">Controller Type</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {props.result.controllerProperties.controllerType}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body2">Problem Formulation</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {props.result.controllerProperties.problemFormulation}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow className={classes.grayed}>
                  <TableCell>
                    <Typography variant="body2">
                      Controller Model Type
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {props.result.controllerProperties.modelType}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body2">Number of States</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {props.result.controllerProperties.numStates}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow className={classes.grayed}>
                  <TableCell>
                    <Typography variant="body2">Prediction Horizon</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {props.result.controllerProperties.predictionHorizon}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        )}
    </div>
  );
};
