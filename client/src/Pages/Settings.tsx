import React from 'react';
import {
  Box,
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
      width: '80%',
      margin: 'auto',
      padding: '16px 0 0 16px',
    },
    bold: {
      fontWeight: 'inherit',
    },
    item: {
      padding: '32px 0 0 0',
      fontWeight: 'inherit',
    },
    subItem: {
      padding: '16px 0 0 0',
    },
    radioRoot: {
      color: '#078b75',
      //colorSecondary: 'green',
      '&$checked': {
        color: '#078b75',
      },
      '&&:hover': {
        backgroundColor: 'transparent',
      },
    },
    checked: {},
  })
);

export const Settings: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box fontWeight="fontWeightBold">
        <Typography variant="h6" className={classes.bold}>
          User Name
        </Typography>
      </Box>
      <Typography variant="subtitle2">
        This will be displayed with your results if you choose to share them.
      </Typography>
      <TextField
        variant="outlined"
        placeholder="User Name"
        size="small"
      ></TextField>
      <Box fontWeight="fontWeightBold">
        <Typography variant="h6" className={classes.item}>
          Change Password
        </Typography>
      </Box>
      <TextField
        variant="outlined"
        placeholder="Password"
        size="small"
        //className={classes.item}
      ></TextField>
      <TextField
        variant="outlined"
        placeholder="Confirm Password"
        size="small"
        className={classes.subItem}
      ></TextField>
      <Box fontWeight="fontWeightBold">
        <Typography variant="h6" className={classes.item}>
          SHARE MY TEST RESULTS
        </Typography>
      </Box>
      <RadioGroup>
        <FormControlLabel
          value="yes"
          control={
            <Radio
              classes={{
                root: classes.radioRoot,
                checked: classes.checked,
              }}
            />
          }
          label="Yes, share all results"
        />
        <FormControlLabel
          value="no"
          control={
            <Radio
              classes={{
                root: classes.radioRoot,
                checked: classes.checked,
              }}
            />
          }
          label="Keep all my results private"
        />
      </RadioGroup>
      <Box fontWeight="fontWeightBold">
        <Typography variant="h6" className={classes.item}>
          About sharing results
        </Typography>
      </Box>
      <Typography variant="subtitle2">
        You can choose which results to share or keep private on your dashboard
        page.
      </Typography>
    </div>
  );
};
