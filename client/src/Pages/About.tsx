import React from 'react';
import ReactMarkdown from 'react-markdown';
import {Divider, Grid, Typography} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: '16px 0 0 16px',
      width: '80%',
      margin: 'auto',
    },
    topText: {
      padding: '16px 0 32px 0',
    },
    bottomText: {
      padding: '32px 0 0 0',
    },
    header: {
      padding: '0 0 16px 0',
    },
  })
);

const aboutText =
  'Advanced control strategies are becoming increasingly necessary in buildings in order to meet and balance requirements for energy efficiency, demand flexibility, and occupant comfort. Additional development and widespread adoption of emerging control strategies, however, ultimately require low implementation costs to reduce payback period and verified performance to gain control vendor, building owner, and operator trust. This is difficult in an already first-cost driven and risk-averse industry.';
const aboutText2 =
  'Recent innovations in building simulation can significantly aid in meeting these requirements and spurring innovation at early stages of development by evaluating performance, comparing state-of-the-art to new strategies, providing installation experience, and testing controller implementations. BOPTEST (Building Optimization Performance Test) aims to provide a web based simulation environment consisting of test cases for the testing of advanced control strategies.';

const publicationsText =
  'D. Blum, F. Jorissen, S. Huang, Y. Chen, J. Arroyo, K. Benne, Y. Li, V. Gavan, L. Rivalin, L. Helsen, D. Vrabie, M. Wetter, and M. Sofos. (2019). “Prototyping the BOPTEST framework for simulation-based testing of advanced control strategies in buildings.” In Proc. of the 16th International Conference of IBPSA, Sep 2 – 4. Rome, Italy.';

const teamMarkdown = `BOPTEST is a partnership between a number of organizations who's members coordinate within the structure of the [IBPSA Project 1](https://github.com/ibpsa/project1). The following institutions have contributed to the BOPTEST development.

* Lawrence Berkeley National Laboratory, Berkeley, USA 
* KU Leuven, Leuven, Belgium
* Pacific Northwest National Laboratory, Richland, USA
* National Renewable Energy Laboratory, Golden, USA
* Engie Lab, Pierrefitte-sur-Seine, France
* Department of Energy, Washington D.C., USA`;

export const About: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={10} className={classes.topText}>
        <Grid item xs={6}>
          <Typography variant="body1">{aboutText}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">{aboutText2}</Typography>
        </Grid>
      </Grid>
      <Divider />
      <Grid container spacing={2} className={classes.bottomText}>
        <Grid item xs={6}>
          <Typography variant="h6" className={classes.header}>
            Publications
          </Typography>
          <Typography variant="body1">{publicationsText}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" className={classes.header}>
            The Team
          </Typography>
          <ReactMarkdown source={teamMarkdown} escapeHtml={false} />
        </Grid>
      </Grid>
    </div>
  );
};
