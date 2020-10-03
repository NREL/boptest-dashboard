import React from 'react';
import {Link} from 'react-router-dom';
import {TextField, Typography} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '16px 0 0 16px',
      width: '60%',
      margin: 'auto',
    },
    fields: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '16px 56px 56px 40px',
      width: '70%',
      margin: 'auto',
    },
    field: {
      padding: '16px 0 16px 0',
      width: '80%',
      margin: 'auto',
    },
  })
);

export const Login: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.fields}>
        <div>
          <Typography variant="h6" className={classes.field}>
            SIGN IN
          </Typography>
          <TextField
            id="email"
            required
            label="Email Address"
            variant="outlined"
            className={classes.fields}
          />
          <TextField
            id="password"
            required
            label="Password"
            variant="outlined"
            className={classes.fields}
          />
          {/* buttons */}
          <div>
            <Link to={'/register'} className={classes.field}>
              Create an Account
            </Link>
          </div>
        </div>
      </Paper>
    </div>
  );
};
