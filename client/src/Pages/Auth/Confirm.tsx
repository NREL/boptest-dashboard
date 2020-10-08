import React from 'react';
import {useHistory, useParams} from 'react-router-dom';
import axios from 'axios';
import {Button, TextField, Typography} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {ConfirmData} from './../../../../common/interfaces';

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
  })
);

const confirmEndpoint = '/api/auth/confirm';

interface ConfirmParams {
  username: string;
}

export const Confirm: React.FC = () => {
  const classes = useStyles();

  const history = useHistory();

  let {username} = useParams<ConfirmParams>();

  // state values for all the text fields
  const [confirmationCode, setConfirmationCode] = React.useState('');

  const handleConfirmationCodeChange = e => {
    setConfirmationCode(e.target.value);
  };

  const confirmUser = () => {
    const confirmData: ConfirmData = {
      username: username,
      verificationCode: confirmationCode,
    };

    axios
      .post(confirmEndpoint, confirmData)
      .then(res => {
        // need to set the user as logged in via context and stash the token
        const confirmResponse = res.data;

        // redirect to login page
        history.push('/login');
      })
      .catch(err => console.log('could not confirm the user', err));
  };

  const title = `Confirm your email address (${username})`;

  return (
    <div className={classes.root}>
      <Paper className={classes.fields}>
        <Typography variant="h6" className={classes.field}>
          {title}
        </Typography>
        <TextField
          id="code"
          required
          label="Confirmation Code"
          variant="outlined"
          className={classes.field}
          onChange={handleConfirmationCodeChange}
        />
        <Button
          variant="contained"
          size="small"
          className={classes.signInButton}
          onClick={confirmUser}
        >
          Confirm
        </Button>
      </Paper>
    </div>
  );
};
