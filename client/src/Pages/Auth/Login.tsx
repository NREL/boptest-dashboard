import React from 'react';
import axios from 'axios';
import {Link, useHistory} from 'react-router-dom';
import {Button, TextField, Typography} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {useUser} from './../../Context/user-context';
import {LoginData} from './../../../../common/interfaces';

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
    },
    registerLink: {
      alignSelf: 'flex-end',
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

  const {setAuthedEmail, setAuthedName} = useUser();

  const handleEmailChange = e => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };

  const signIn = () => {
    const loginData: LoginData = {
      email,
      password,
    };

    axios
      .post(loginEndpoint, loginData)
      .then(res => {
        // need to set the user as logged in via context
        setAuthedEmail(res.data.email);
        setAuthedName(res.data.name);

        // redirect to the home page
        history.push('/');
      })
      .catch(err => console.log('could not log the user in', err));
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.fields}>
        <Typography variant="h6" className={classes.field}>
          SIGN IN
        </Typography>
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
          type="password"
          className={classes.field}
          onChange={handlePasswordChange}
        />
        {/* buttons */}
        <Button
          variant="contained"
          size="small"
          className={classes.signInButton}
          onClick={signIn}
        >
          SIGN IN
        </Button>
        <div className={classes.actionItems}>
          <Link to={'/'} className={classes.forgotPassword}>
            Forgot Password
          </Link>
          <Link to={'/register'} className={classes.registerLink}>
            Create an Account
          </Link>
        </div>
      </Paper>
    </div>
  );
};
