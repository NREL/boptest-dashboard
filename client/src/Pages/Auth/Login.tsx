import React from 'react';
import axios from 'axios';
import {Link, useHistory} from 'react-router-dom';
import {Button, Typography} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {useUser} from './../../Context/user-context';
import {LoginData} from '../../../common/interfaces';
import {AppRoute} from '../../enums';

const Alert = props => <MuiAlert elevation={6} variant="filled" {...props} />;

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: '5em',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      padding: '1em',
      width: '50%',
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
    signInButton: {
      justifyContent: 'center',
      padding: '0 16px 0 16px',
      backgroundColor: 'rgb(0, 150, 136)',
      color: 'white',
      width: '80%',
      margin: 'auto',
    },
    actionItems: {
      padding: '16px 0 0 0',
      width: '80%',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    forgotPassword: {
      alignSelf: 'flex-start',
      textDecoration: 'none',
    },
    registerLink: {
      alignSelf: 'flex-end',
      textDecoration: 'none',
    },
  })
);

const loginEndpoint = '/api/auth/login';

export const Login: React.FC = () => {
  const classes = useStyles();

  const history = useHistory();

  // state values for all the text fields
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [snackMessageOpen, setSnackMessageOpen] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState('');

  const {setAuthedEmail, setAuthedName} = useUser();

  const handleEmailChange = e => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };

  const handleSnackMessageClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackMessageOpen(false);
  };

  const signIn = () => {
    setIsLoading(true);
    const loginData: LoginData = {
      email,
      password,
    };

    axios
      .post(loginEndpoint, loginData)
      .then(res => {
        setAuthedEmail(res.data.email);
        setAuthedName(res.data.name);
        history.push('/');
      })
      .catch(err => {
        setIsLoading(false);
        setSnackMessage(err.response.data.message);
        setSnackMessageOpen(true);
      });
  };

  return (
    <div className={classes.root}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Paper className={classes.paper}>
          <ValidatorForm onSubmit={signIn} className={classes.fields}>
            <Typography variant="h6" className={classes.field}>
              SIGN IN
            </Typography>
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
            {/* buttons */}
            <Button
              variant="contained"
              size="small"
              className={classes.signInButton}
              type="submit"
            >
              SIGN IN
            </Button>
            <div className={classes.actionItems}>
              <Link
                to={AppRoute.ForgotPassword}
                className={classes.forgotPassword}
              >
                Forgot Password
              </Link>
              <Link to={'/register'} className={classes.registerLink}>
                Create an Account
              </Link>
            </div>
          </ValidatorForm>
        </Paper>
      )}
      <Snackbar
        open={snackMessageOpen}
        autoHideDuration={6000}
        onClose={handleSnackMessageClose}
      >
        <Alert onClose={handleSnackMessageClose} severity="error">
          {snackMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
