import React, {useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import axios from 'axios';
import {Button, Typography} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {AlertProps} from '@material-ui/lab/Alert';
import {AppRoute} from '../../enums';

const Alert = (props: AlertProps) => (
  <MuiAlert elevation={6} variant="filled" {...props} />
);

const useStyles = makeStyles(() =>
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
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [snackMessage, setSnackMessage] = React.useState('');
  const [snackMessageOpen, setSnackMessageOpen] = React.useState(false);
  const history = useHistory();

  const handleConfirmationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmationCode(e.target.value);
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleSnackMessageClose = (
    _: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackMessageOpen(false);
  };

  interface ConfirmNewPasswordPayload {
    username: string;
    verificationCode: string;
    newPassword: string;
  }

  const confirmNewPassword = () => {
    const confirmNewPassData: ConfirmNewPasswordPayload = {
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
      .catch(error => {
        setSnackMessage(error.response.data.message);
        setSnackMessageOpen(true);
      });
  };

  const title = 'CONFIRM PASSWORD';

  useEffect(() => {
    ValidatorForm.addValidationRule('isPasswordMatch', (value: string) => {
      return value === password;
    });
    return () => {
      ValidatorForm.removeValidationRule('isPasswordMatch');
    };
  }, [password]);

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
              label="New Password"
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
              label="Confirm New Password"
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
            <Link to={AppRoute.Dashboard} className={classes.cancelLink}>
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
