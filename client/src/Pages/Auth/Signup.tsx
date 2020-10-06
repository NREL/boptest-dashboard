import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Button, TextField, Typography} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {SignupData} from './../../../../common/interfaces';

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
    registerButton: {
      justifyContent: 'center',
      padding: '0 16px 0 16px',
      width: '25%',
      backgroundColor: 'rgb(0, 150, 136)',
      color: 'white',
    },
    actionItems: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  })
);

const registerEndpoint = '/api/auth/signup';

export const Signup: React.FC = () => {
  const classes = useStyles();

  // state values for all the text fields
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleUsernameChange = e => {
    setUsername(e.target.value);
  };
  const handleEmailChange = e => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = e => {
    setConfirmPassword(e.target.value);
  };

  // need to do some error handling here and also send request to backend
  const registerAccount = () => {
    console.log(username);
    console.log(email);
    console.log(password);
    console.log(confirmPassword);

    if (password !== confirmPassword) {
      console.log('show an error message here passwords do not match');
      return;
    }

    const signupData: SignupData = {
      username,
      email,
      password,
    };

    console.log(signupData);

    axios
      .post(registerEndpoint, signupData)
      .then(res => {
        // need to set the user as logged in via context and stash the token
        const signupResponse = res.data;
        console.log('welcome to Boptest', signupResponse.username);

        // redirect to the home page or user dashboard at this point?
      })
      .catch(err => console.log('could not signup the user', err));
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.fields}>
        <Typography variant="h6" className={classes.field}>
          REGISTER
        </Typography>
        <TextField
          id="username"
          required
          label="User Name"
          variant="outlined"
          className={classes.field}
          onChange={handleUsernameChange}
        />
        <TextField
          id="email"
          required
          label="Email Address"
          variant="outlined"
          className={classes.field}
          onChange={handleEmailChange}
        />
        <TextField
          id="password"
          required
          label="Password"
          variant="outlined"
          className={classes.field}
          onChange={handlePasswordChange}
        />
        <TextField
          id="confirm_password"
          required
          label="Confirm Password"
          variant="outlined"
          className={classes.field}
          onChange={handleConfirmPasswordChange}
        />
        {/* buttons */}
        <div className={classes.actionItems}>
          <Link to={'/'} className={classes.field}>
            Cancel
          </Link>
          <Button
            variant="contained"
            size="small"
            className={classes.registerButton}
            onClick={registerAccount}
          >
            Register
          </Button>
        </div>
      </Paper>
    </div>
  );
};
