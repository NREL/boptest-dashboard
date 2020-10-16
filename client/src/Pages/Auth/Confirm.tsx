import React from 'react';
import {useHistory, useParams} from 'react-router-dom';
import axios from 'axios';
import {Button, Typography} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {ConfirmData} from './../../../../common/interfaces';
import {useUser} from './../../Context/user-context';

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

  const {setAuthedEmail, setAuthedName} = useUser();

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
        // need to set the user as logged in via context
        setAuthedEmail(res.data.email);
        setAuthedName(res.data.name);

        // redirect to home page
        history.push('/');
      })
      .catch(err => console.log('could not confirm the user', err));
  };

  const title = `Confirm your email address (${username})`;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <ValidatorForm onSubmit={confirmUser} className={classes.fields}>
          <Typography variant="h6" className={classes.field}>
            {title}
          </Typography>
          <div className={classes.field}>
            <TextValidator
              label="Confirmation Code"
              onChange={handleConfirmationCodeChange}
              id="code"
              name="code"
              variant="outlined"
              value={confirmationCode}
              validators={['required']}
              errorMessages={['This field is required']}
              className={classes.validateField}
            />
          </div>
          <Button
            variant="contained"
            size="small"
            type="submit"
            className={classes.signInButton}
          >
            Confirm
          </Button>
        </ValidatorForm>
      </Paper>
    </div>
  );
};
