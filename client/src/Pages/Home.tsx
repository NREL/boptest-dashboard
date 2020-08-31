import React from 'react';
import {Box, Button, Grid, Typography} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const textSample1 = ` October arrived, spreading a damp chill over the grounds and into the castle. Madam Pomfrey, the nurse, was kept busy by a sudden spate of colds among the staff and students. Her Pepperup potion worked instantly, though it left the drinker smoking at the ears for several hours afterward. Ginny Weasley, who had been looking pale, was bullied into taking some by Percy. The steam pouring from under her vivid hair gave the impression that her whole head was on fire.

Raindrops the size of bullets thundered on the castle windows for days on end; the lake rose, the flower beds turned into muddy streams, and Hagrid's pumpkins swelled to the size of garden sheds. Oliver Wood's enthusiasm for regular training sessions, however, was not dampened, which was why Harry was to be found, late one stormy Saturday afternoon a few days before Halloween, returning to Gryffindor Tower, drenched to the skin and splattered with mud.`;

const textSample2 = `He stumbled to a halt, clutching at the stone wall, listening with all his might, looking around, squinting up and down the dimly lit passageway.

"Harry, what're you -?"

"It's that voice again - shut up a minute -"

". . . soo hungry . . . for so long . . ."

"Listen!" said Harry urgently, and Ron and Hermione froze, watching him.

". . . kill . . . time to kill . . ."

The voice was growing fainter. Harry was sure it was moving away - moving upward. A mixture of fear and excitement gripped him as he stared at the dark ceiling; how could it be moving upward? Was it a phantom, to whom stone ceilings didn't matter?

"This way," he shouted, and he began to run, up the stairs, into the entrance hall. It was no good hoping to hear anything here, the babble of talk from the Halloween feast was echoing out of the Great Hall. Harry sprinted up the marble staircase to the first floor, Ron and Hermione clattering behind him.

"Harry, what're we -"

"SHH!"

Harry strained his ears. Distantly, from the floor above, and growing fainter still, he heard the voice: ". . . I smell blood. . . . I SMELL BLOOD!"

His stomach lurched -

"It's going to kill someone!" he shouted, and ignoring Ron's and Hermione's bewildered faces, he ran up the next flight of steps three at a time, trying to listen over his own pounding footsteps -

Harry hurtled around the whole of the second floor, Ron and Hermione panting behind him, not stopping until they turned a corner into the last, deserted passage.`;

const controlsAlgorithm = `The need for advanced control strategies (ACS) in buildings is growing due to emerging objectives to reduce energy consumption, integrate with district thermal networks, and improve responsiveness and service to occupants.`;
const virtualBuildings = `The BOPTEST (Building Operation TESTing) Framework consists of a set of Modelica models that represent different buildings with different HVAC systems in different climate zones. BOPTEST exposes the "control points" of these models using a standard, familiar API that allows control algorithms to interact with the models as if they are physical buildings. The BOPTEST Framework also includes standardized key performance indicators (KPI) and reports and infrastrcuture for simulation-based comparison, benchmarking, and debugging of ACS.`;
const resultsDesc = `BOPTEST is an open and level playing field on which different control algorithms can be quantitatively benchmarked and compared. In addition, it is a virtual environment field that supports meaningful experiements with control algorithms without the need for physical installations in existing buildings.`;
const docsButtonText = 'Get Started With The Docs';

const useStyles = makeStyles((theme: Theme) =>
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
    icon: {
      padding: '0 0 32px 0',
    },
    docsButton: {
      textAlign: 'center',
      padding: '16px 0 0 0',
      backgroundColor: 'rgb(0, 150, 136)',
      color: 'white',
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
        <Grid item xs={9}>
          {/* make new grid here for inside the other grid */}
          <Typography variant="body1" className={classes.icon}>
            {textSample1}
          </Typography>
          <Grid container spacing={3} className={classes.descriptions}>
            <Grid item xs={4}>
              <Box fontWeight="fontWeightBold">
                <Typography variant="h6">CONTROLS ALGORITHM</Typography>
              </Box>
              <Typography variant="body1">{controlsAlgorithm}</Typography>
              <Button
                className={classes.docsButton}
                variant="contained"
                size="medium"
              >
                {docsButtonText}
              </Button>
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
          <Typography variant="body1">{textSample2}</Typography>
        </Grid>
      </Grid>
    </div>
  );
};
