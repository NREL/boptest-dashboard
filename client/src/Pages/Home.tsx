import React from 'react';
import {Link} from 'react-router-dom';
import {Box, Button, Grid, Typography} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {ResultsQuickView} from './../Components/ResultsQuickView';
import {AppRoute} from '../enums';

import {ReactComponent as WorkflowDiagram} from '../static/assets/workflow-diagram.svg';

const controlsAlgorithm =
  'The need for advanced control strategies (ACS) in buildings is growing due to emerging objectives to reduce energy consumption, integrate with the electric power grid, integrate with district thermal networks, and improve responsiveness and service to occupants.';
const virtualBuildings =
  'The BOPTEST (Building Operation Testing) Framework consists of a set of expertly designed Modelica models that span a range of building types, HVAC system configurations, and climate zones. BOPTEST exposes the "control points" of these models using a simple web based API that allows control algorithms to interact with the models as if they are physical buildings.';
const resultsDesc =
  'BOPTEST generates standard key performance indicators (KPIs) and provides a interface to share results, which enables comparisons, benchmarking, and debugging of ACS. BOPTEST is an open and level playing field on which different control algorithms can be quantitatively evaluated. In addition, BOPTEST is a virtual environment that supports meaningful experiments with control algorithms without the need for physical installations in buildings.';
const exploreButtonText = 'Explore Shared Results';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: '16px',
    },
    bold: {
      fontWeight: 'inherit',
    },
    descriptions: {
      padding: '8px 16px 0 16px',
      backgroundColor: 'rgb(236, 239, 240)',
    },
    imageContainer: {
      padding: '0 0 32px 0',
      display: 'flex',
      justifyContent: 'left',
      alignItems: 'center',
      overflow: 'hidden',
    },
    image: {
      flexShrink: 0,
      width: '90%',
      height: '40%',
    },
    docsButton: {
      textAlign: 'center',
      padding: '16px',
      backgroundColor: 'rgb(0, 150, 136)',
      color: 'white',
    },
    wideGridItem: {
      borderRight: '1px solid lightgray',
    },
    link: {
      color: 'white',
      textDecoration: 'none',
    },
  })
);

export const Home: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {/* this grid holds the entire page to split into 2 horizontal slices */}
      <Grid container spacing={4}>
        {/* this grid item holds the chunkier left side with a long image and text on bottom */}
        <Grid className={classes.wideGridItem} item xs={9}>
          {/* make new grid here for inside the other grid */}
          <div className={classes.imageContainer}>
            <div className={classes.image}>
              <WorkflowDiagram />
            </div>
          </div>
          <Grid container spacing={3} className={classes.descriptions}>
            <Grid item xs={4}>
              <Box fontWeight="fontWeightBold">
                <Typography variant="h6">CONTROLS ALGORITHM</Typography>
              </Box>
              <Typography variant="body1">{controlsAlgorithm}</Typography>
              <Link to={AppRoute.Results} className={classes.link}>
                <Button
                  className={classes.docsButton}
                  variant="contained"
                  size="large"
                >
                  {exploreButtonText}
                </Button>
              </Link>
            </Grid>
            <Grid item xs={4}>
              <Box fontWeight="fontWeightBold">
                <Typography variant="h6">
                  VIRTUAL BUILDINGS/ EQUIPMENT
                </Typography>
              </Box>
              <Typography variant="body1">{virtualBuildings}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Box fontWeight="fontWeightBold">
                <Typography variant="h6">RESULTS</Typography>
              </Box>
              <Typography variant="body1">{resultsDesc}</Typography>
            </Grid>
          </Grid>
        </Grid>
        {/* this grid item houses the results list on the right side */}
        <Grid item xs={3}>
          <Box fontWeight="fontWeightBold">
            <Typography variant="h6">LATEST TEST RESULTS</Typography>
          </Box>
          <ResultsQuickView />
        </Grid>
      </Grid>
    </div>
  );
};
