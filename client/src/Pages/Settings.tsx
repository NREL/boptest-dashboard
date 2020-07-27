import React from 'react';
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
  })
);

export const Settings: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h6">User Name</Typography>
      <Typography variant="subtitle2">
        This will be displayed with your results if you choose to share them.
      </Typography>
      <TextField
        variant="outlined"
        placeholder="User Name"
        size="small"
      ></TextField>
      <Typography variant="h6">Change Password</Typography>
      <TextField
        variant="outlined"
        placeholder="Password"
        size="small"
      ></TextField>
      <TextField
        variant="outlined"
        placeholder="Confirm Password"
        size="small"
      ></TextField>
      <Typography variant="h6">SHARE MY TEST RESULTS</Typography>
      <RadioGroup>
        <FormControlLabel
          value="yes"
          control={<Radio />}
          label="Yes, share all results"
        />
        <FormControlLabel
          value="no"
          control={<Radio />}
          label="Keep all my results private"
        />
      </RadioGroup>
      <Typography variant="h6">About sharing results</Typography>
      <Typography variant="subtitle2">
        You can choose which results to share or keep private on your dashboard
        page.
      </Typography>
    </div>
  );
};
