import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useDashboardLayoutStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      flex: 1,
      minHeight: 0,
      overflow: 'hidden',
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1, 0, 2),
      },
    },
    paper: {
      padding: theme.spacing(0),
      overflow: 'hidden',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      minHeight: 0,
    },
    paperMobile: {
      background: 'transparent',
      boxShadow: 'none',
      borderRadius: 0,
    },
    header: {
      padding: theme.spacing(3, 3, 1.5),
    },
    subheader: {
      padding: theme.spacing(0, 3, 2),
      color: theme.palette.text.secondary,
    },
    statusContainer: {
      padding: theme.spacing(5),
      textAlign: 'center',
      backgroundColor: 'transparent',
    },
    tableWrapper: {
      flex: 1,
      minHeight: 0,
      display: 'flex',
    },
    mobileListWrapper: {
      flex: 1,
      minHeight: 0,
      display: 'flex',
    },
    detailHeaderActions: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
  })
);
