import React, {useEffect, useState} from 'react';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import axios from 'axios';
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {ChangePasswordData} from '../../../common/interfaces';
import {useUser} from '../Context/user-context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '70%',
      margin: 'auto',
      padding: '16px 0 0 16px',
    },
    bold: {
      fontWeight: 'inherit',
    },
    fieldContainer: {
      display: 'flex',
      margin: '0 64px 0 0',
      justifyContent: 'space-between',
    },
    field: {
      flexGrow: 2,
    },
    validatedField: {
      width: '100%',
      margin: 'auto',
    },
    passwordField: {
      flexGrow: 2,
      width: '69.25%',
      margin: '0 64px 0 0',
      padding: '0 0 16px 0',
    },
    confirmPasswordField: {
      flexGrow: 2,
      width: '100%',
    },
    applyButton: {
      flexGrow: 1,
    },
    item: {
      padding: '32px 0 0 0',
      fontWeight: 'inherit',
    },
    subItem: {
      padding: '16px 0 0 0',
    },
    radioRoot: {
      color: '#078b75',
      //colorSecondary: 'green',
      '&$checked': {
        color: '#078b75',
      },
      '&&:hover': {
        backgroundColor: 'transparent',
      },
    },
    checked: {},
  })
);

const changePasswordEndpoint = '/api/auth/changePassword';

export const Settings: React.FC = () => {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {authedEmail} = useUser();

  const handleUserNameChange = event => {
    setUsername(event.target.value);
  };

  const handleOldPasswordChange = event => {
    setOldPassword(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = event => {
    setConfirmPassword(event.target.value);
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

  const shareResults = event => {
    // call the share results endpoint with the new value.
    //event.target.value will be 'yes' or 'no' based on radio button values below
    console.log(event.target.value);
  };

  const changeUserName = () => {
    // make a call to change the username of the current user
  };

  const changePassword = () => {
    console.log(
      `calling change password with ${password} and ${confirmPassword} from ${oldPassword}`
    );

    console.log('email', authedEmail);

    const data: ChangePasswordData = {
      email: authedEmail,
      oldPassword: oldPassword,
      newPassword: password,
    };

    axios
      .post(changePasswordEndpoint, data)
      .then(() => {})
      .catch(err => alert(`Could not change your password. Error: ${err}`));
  };

  return (
    <div className={classes.root}>
      <Box fontWeight="fontWeightBold">
        <Typography variant="h6" className={classes.bold}>
          User Name
        </Typography>
      </Box>
      <Typography variant="subtitle2">
        This will be displayed with your results if you choose to share them.
      </Typography>
      <div className={classes.fieldContainer}>
        <TextField
          value={username}
          variant="outlined"
          placeholder="User Name"
          size="small"
          className={classes.field}
          onChange={event => handleUserNameChange(event)}
        ></TextField>
        <Button className={classes.applyButton} onClick={changeUserName}>
          Apply
        </Button>
      </div>
      <Box fontWeight="fontWeightBold">
        <Typography variant="h6" className={classes.item}>
          Change Password
        </Typography>
      </Box>
      <ValidatorForm onSubmit={changePassword}>
        <div className={classes.fieldContainer}>
          <div className={classes.validatedField}>
            <TextValidator
              label="Old Password"
              onChange={handleOldPasswordChange}
              id="oldpassword"
              name="oldpassword"
              type="password"
              variant="outlined"
              value={oldPassword}
              validators={['required']}
              errorMessages={['This field is required']}
              className={classes.passwordField}
            />
          </div>
          <div className={classes.applyButton}></div>
        </div>
        <div className={classes.fieldContainer}>
          <div className={classes.validatedField}>
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
              className={classes.passwordField}
            />
          </div>
          <div className={classes.applyButton}></div>
        </div>
        <div className={classes.fieldContainer}>
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
              className={classes.confirmPasswordField}
            />
          </div>
          <Button type="submit" className={classes.applyButton}>
            Apply
          </Button>
        </div>
      </ValidatorForm>
      {/* <div className={classes.fieldContainer}>
        <TextField
          variant="outlined"
          placeholder="Password"
          size="small"
          type="password"
          onChange={event => handlePasswordChange(event)}
          className={classes.passwordField}
        ></TextField>
        <div className={classes.applyButton}></div>
      </div>
      <div className={classes.fieldContainer}>
        <TextField
          variant="outlined"
          placeholder="Confirm Password"
          size="small"
          type="password"
          onChange={event => handleConfirmPasswordChange(event)}
          className={classes.field}
        ></TextField>
        <Button type="submit" className={classes.applyButton}>
          Apply
        </Button>
      </div> */}
      <Box fontWeight="fontWeightBold">
        <Typography variant="h6" className={classes.item}>
          Share My Test Results
        </Typography>
      </Box>
      <RadioGroup onChange={event => shareResults(event)}>
        <FormControlLabel
          value="yes"
          control={
            <Radio
              classes={{
                root: classes.radioRoot,
                checked: classes.checked,
              }}
            />
          }
          label="Yes, share all results"
        />
        <FormControlLabel
          value="no"
          control={
            <Radio
              classes={{
                root: classes.radioRoot,
                checked: classes.checked,
              }}
            />
          }
          label="Keep all my results private"
        />
      </RadioGroup>
      <Box fontWeight="fontWeightBold">
        <Typography variant="h6" className={classes.item}>
          About sharing results
        </Typography>
      </Box>
      <Typography variant="subtitle2">
        You can choose which results to share or keep private on your dashboard
        page.
      </Typography>
    </div>
  );
};
