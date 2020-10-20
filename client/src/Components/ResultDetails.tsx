import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import {Divider, Grid} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {SignatureDetails} from '../../../common/interfaces';

interface ResultDetailsProps {
  result: any;
}

const getSignatureEndpoint = (resultId: string) => {
  return `/api/results/${resultId}/signature`;
};

// props here are just going to be a result. Need to type it with an interface
// once we have the shared models
export const ResultDetails: React.FC<ResultDetailsProps> = props => {
  const [details, setDetails] = useState<SignatureDetails | undefined>(
    undefined
  );

  // this useEffect will be used to get the testcase signature for ranges if applicable
  useEffect(() => {
    axios.get(getSignatureEndpoint(props.result.id)).then(response => {
      setDetails(response.data);
      console.log('response details', details);
    });
  }, [props.result]);

  return (
    <div>
      <Grid container spacing={5}>
        <Grid item xs={5}>
          <List>
            <ListItem>
              <Typography variant="h5">TEST CASE</Typography>
            </ListItem>
            <ListItem>
              <Typography variant="h6">Builing Type</Typography>
            </ListItem>
            <ListItem>{props.result.buildingTypeName}</ListItem>
            <ListItem>
              <Typography variant="h6">Parameters</Typography>
            </ListItem>
            <ListItem>
              <ListItemText>Simulation Time</ListItemText>
              <ListItemText>{props.result.dateRun}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>Price Scenario</ListItemText>
              <ListItemText>{props.result.priceScenario}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>Weather Forecast Uncertainty</ListItemText>
              <ListItemText>
                {props.result.weatherForecastUncertainty}
              </ListItemText>
            </ListItem>
            {/* TODO if the controller properties aren't null, we need to smartly render them here  */}
            {/* <ListItem>
          <Typography variant="h6">Controller Description</Typography>
        </ListItem> */}
            <ListItem>
              <Typography variant="h6">General</Typography>
            </ListItem>
            <ListItem>
              <ListItemText>Identifier</ListItemText>
              <ListItemText>{props.result.resultUid}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>Simulation Time</ListItemText>
              <ListItemText>{props.result.dateRun}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>Contact</ListItemText>
              <ListItemText>{props.result.accountUsername}</ListItemText>
            </ListItem>
          </List>
        </Grid>
        <Divider orientation="vertical" />
        <Grid item xs={5}>
          <List>
            <ListItem>
              <Typography variant="h6">Key Performance Indicators</Typography>
            </ListItem>
            <ListItem>
              <ListItemText>Energy [kWh]</ListItemText>
              <ListItemText>{props.result.totalEnergy}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>Thermal Discomfort [Kh]</ListItemText>
              <ListItemText>{props.result.thermalDiscomfort}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>Cost [EUR]</ListItemText>
              <ListItemText>{props.result.cost}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>Emissions [kgCO2]</ListItemText>
              <ListItemText>{props.result.cost}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>IAQ [ppmh]</ListItemText>
              <ListItemText>{props.result.aqDiscomfort}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>Time Ratio</ListItemText>
              <ListItemText>{props.result.timeRatio}</ListItemText>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </div>
  );
};
