import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import axios from 'axios';
import {Button, Typography} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {SignupData} from './../../../../common/interfaces';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '16px 0 0 16px',
      width: '60%',
      margin: 'auto',
    },
    paper: {
      padding: '16px 56px 56px 40px',
      width: '60%',
      margin: 'auto',
    },
    fields: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    field: {
      padding: '0 0 16px 0',
      width: '80%',
      margin: 'auto',
    },
    validateField: {
      width: '100%',
      margin: 'auto',
    },
    registerButton: {
      alignSelf: 'flex-end',
      padding: '0 16px 0 16px',
      width: '25%',
      backgroundColor: 'rgb(0, 150, 136)',
      color: 'white',
    },
    actionItems: {
      padding: '48px 0 0 0',
      width: '80%',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cancelLink: {
      alignSelf: 'flex-start',
    },
  })
);

const registerEndpoint = '/api/auth/signup';

export const Signup: React.FC = props => {
  const classes = useStyles();

  const history = useHistory();

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
    if (password !== confirmPassword) {
      // TODO front end errors for issues in the UI
      console.log('show an error message here passwords do not match');
      return;
    }

    const signupData: SignupData = {
      username,
      email,
      password,
    };

    axios
      .post(registerEndpoint, signupData)
      .then(() => {
        // redirect to the Confirm page
        history.push(`/confirm/${email}`);
      })
      .catch(err => console.log('could not signup the user', err));
  };

  useEffect(() => {
    // custom rule will have name 'isPasswordMatch'
    ValidatorForm.addValidationRule('isPasswordMatch', value => {
      if (value !== password) {
        return false;
      }
      return true;
    });
  });

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <ValidatorForm onSubmit={registerAccount} className={classes.fields}>
          <Typography variant="h6" className={classes.field}>
            REGISTER
          </Typography>
          <div className={classes.field}>
            <TextValidator
              label="User Name"
              onChange={handleUsernameChange}
              id="username"
              name="username"
              variant="outlined"
              value={username}
              validators={['required']}
              errorMessages={['This field is required']}
              className={classes.validateField}
            />
          </div>
          <div className={classes.field}>
            <TextValidator
              label="Email"
              onChange={handleEmailChange}
              id="email"
              name="email"
              variant="outlined"
              value={email}
              validators={['required', 'isEmail']}
              errorMessages={[
                'This field is required',
                'This field needs to be an email address',
              ]}
              className={classes.validateField}
            />
          </div>
          <div className={classes.field}>
            <TextValidator
              label="Password"
              onChange={handlePasswordChange}
              id="password"
              name="password"
              type="password"
              variant="outlined"
              value={password}
              validators={['required']}
              errorMessages={['This field is required']}
              className={classes.validateField}
            />
          </div>
          <div className={classes.field}>
            <TextValidator
              label="Confirm Password"
              onChange={handleConfirmPasswordChange}
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              variant="outlined"
              value={confirmPassword}
              validators={['isPasswordMatch', 'required']}
              errorMessages={[
                'Passwords do not match',
                'This field is required',
              ]}
              className={classes.validateField}
            />
          </div>
          {/* buttons */}
          <div className={classes.actionItems}>
            <Link to={'/'} className={classes.cancelLink}>
              Cancel
            </Link>
            <Button
              variant="contained"
              size="small"
              type="submit"
              className={classes.registerButton}
            >
              Register
            </Button>
          </div>
        </ValidatorForm>
      </Paper>
    </div>
  );
};
