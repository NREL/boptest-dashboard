import React from 'react';
import {Divider, Grid, Typography} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
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

const textSample1 = ` October arrived, spreading a damp chill over the grounds and into the castle. Madam Pomfrey, the nurse, was kept busy by a sudden spate of colds among the staff and students. Her Pepperup potion worked instantly, though it left the drinker smoking at the ears for several hours afterward. Ginny Weasley, who had been looking pale, was bullied into taking some by Percy. The steam pouring from under her vivid hair gave the impression that her whole head was on fire.

Raindrops the size of bullets thundered on the castle windows for days on end; the lake rose, the flower beds turned into muddy streams, and Hagrid's pumpkins swelled to the size of garden sheds. Oliver Wood's enthusiasm for regular training sessions, however, was not dampened, which was why Harry was to be found, late one stormy Saturday afternoon a few days before Halloween, returning to Gryffindor Tower, drenched to the skin and splattered with mud.

Even aside from the rain and wind it hadn't been a happy practice session. Fred and George, who had been spying on the Slytherin team, had seen for themselves the speed of those new Nimbus Two Thousand and Ones. They reported that the Slytherin team was no more than seven greenish blurs, shooting through the air like missiles.

As Harry squelched along the deserted corridor he came across somebody who looked just as preoccupied as he was. Nearly Headless Nick, the ghost of Gryffindor Tower, was staring morosely out of a window, muttering under his breath, ". . . don't fulfill their requirements . . . half an inch, if that . . ."

"Hello, Nick," said Harry.

"Hello, hello," said Nearly Headless Nick, starting and looking round. He wore a dashing, plumed hat on his long curly hair, and a tunic with a ruff, which concealed the fact that his neck was almost completely severed. He was pale as smoke, and Harry could see right through him to the dark sky and torrential rain outside.`;

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

export const About: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={2} className={classes.topText}>
        <Grid item xs={6}>
          <Typography variant="body1">{textSample1}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">{textSample2}</Typography>
        </Grid>
      </Grid>
      <Divider />
      <Grid container spacing={2} className={classes.bottomText}>
        <Grid item xs={6}>
          <Typography variant="h6" className={classes.header}>
            Publications
          </Typography>
          <Typography variant="body1">{textSample1}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" className={classes.header}>
            The Team
          </Typography>
          <Typography variant="body1">{textSample2}</Typography>
        </Grid>
      </Grid>
    </div>
  );
};
