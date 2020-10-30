import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import axios from 'axios';
import {Button, Typography} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {ConfirmNewPasswordData} from '../../../../common/interfaces';
import {AppRoute} from '../../enums';

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
    confirmButton: {
      alignSelf: 'flex-end',
      padding: '0 16px 0 16px',
      width: '25%',
      backgroundColor: 'rgb(0, 150, 136)',
      color: 'white',
    },
  })
);

const confirmNewPasswordEndpoint = '/api/auth/confirmNewPassword';

export const ConfirmPassword: React.FC = () => {
  const classes = useStyles();

  // state values for all the text fields
  const [confirmationCode, setConfirmationCode] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const history = useHistory();

  const handleConfirmationCodeChange = e => {
    setConfirmationCode(e.target.value);
  };
  const handleEmailChange = e => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };

  const confirmNewPassword = () => {
    const confirmNewPassData: ConfirmNewPasswordData = {
      username: email,
      verificationCode: confirmationCode,
      newPassword: password,
    };

    axios
      .post(confirmNewPasswordEndpoint, confirmNewPassData)
      .then(() => {
        // redirect to the Confirm page
        history.push(AppRoute.Login);
      })
      .catch(err => console.log('could not confirm the new password', err));
  };

  const title = 'CONFIRM PASSWORD';

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <ValidatorForm onSubmit={confirmNewPassword} className={classes.fields}>
          <Typography variant="h6" className={classes.field}>
            {title}
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
          <div className={classes.actionItems}>
            <Link to={AppRoute.Home} className={classes.cancelLink}>
              Cancel
            </Link>
            <Button
              variant="contained"
              size="small"
              type="submit"
              className={classes.confirmButton}
            >
              Confirm New Password
            </Button>
          </div>
        </ValidatorForm>
      </Paper>
    </div>
  );
};
