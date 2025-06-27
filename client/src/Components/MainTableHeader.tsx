import React from 'react';
import { makeStyles, createStyles, useTheme, Theme } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerPaper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(2, 3),
      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
    },
    toggleContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    headerTitle: {
      fontWeight: 600,
      color: theme.palette.primary.main,
      letterSpacing: '0.02em',
    },
    switch: {
      '& .MuiSwitch-track': {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      },
      '& .MuiSwitch-thumb': {
        backgroundColor: '#ffffff',
      },
      '& .Mui-checked + .MuiSwitch-track': {
        backgroundColor: `${theme.palette.primary.main} !important`,
        opacity: 0.5,
      },
      '& .Mui-checked .MuiSwitch-thumb': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    switchLabel: {
      fontSize: '0.875rem',
      fontWeight: 500,
      marginLeft: theme.spacing(1),
    }
  })
);

interface MainTableHeaderProps {
  viewMyResults: boolean;
  onToggleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoggedIn: boolean;
}

const MainTableHeader: React.FC<MainTableHeaderProps> = ({
  viewMyResults,
  onToggleChange,
  isLoggedIn
}) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Paper className={classes.headerPaper} elevation={0}>
      <Typography variant="h6" className={classes.headerTitle}>
        {viewMyResults ? "My Results" : "All Results"}
      </Typography>
      
      {isLoggedIn && (
        <div className={classes.toggleContainer}>
          <FormControlLabel
            control={
              <Switch
                checked={viewMyResults}
                onChange={onToggleChange}
                color="primary"
                className={classes.switch}
              />
            }
            label={viewMyResults ? "My Results" : "All Results"}
            className={classes.switchLabel}
          />
        </div>
      )}
    </Paper>
  );
};

export default MainTableHeader;