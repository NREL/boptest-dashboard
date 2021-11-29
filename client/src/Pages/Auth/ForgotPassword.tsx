import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import axios from 'axios';
import {Button, Typography} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {ForgotPasswordData} from '../../../common/interfaces';
import {AppRoute} from '../../enums';

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
      padding: '32px 0 0 0',
      width: '80%',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cancelLink: {
      alignSelf: 'flex-start',
    },
    sendEmailButton: {
      alignSelf: 'flex-end',
      padding: '0 16px 0 16px',
      width: '45%',
      backgroundColor: 'rgb(0, 150, 136)',
      color: 'white',
    },
  })
);

const forgotPasswordEndpoint = '/api/auth/forgotPassword';

export const ForgotPassword: React.FC = () => {
  const classes = useStyles();

  // state values for all the text fields
  const [email, setEmail] = React.useState('');
  const history = useHistory();

  const handleEmailChange = e => {
    setEmail(e.target.value);
  };

  const beginPasswordReset = () => {
    const forgotPasswordData: ForgotPasswordData = {
      email: email,
    };

    axios
      .post(forgotPasswordEndpoint, forgotPasswordData)
      .then(() => history.push(AppRoute.ConfirmPassword))
      .catch(err =>
        console.log(
          'could not start the forgot password process, please try again',
          err
        )
      ); // TODO
  };

  const title = 'FORGOT PASSWORD';

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <ValidatorForm onSubmit={beginPasswordReset} className={classes.fields}>
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
          <div className={classes.actionItems}>
            <Link to={AppRoute.Home} className={classes.cancelLink}>
              Cancel
            </Link>
            <Button
              variant="contained"
              size="small"
              type="submit"
              className={classes.sendEmailButton}
            >
              Send an email to reset password
            </Button>
          </div>
        </ValidatorForm>
      </Paper>
    </div>
  );
};
