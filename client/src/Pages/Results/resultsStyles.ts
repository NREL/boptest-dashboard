import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useResultsLayoutStyles = makeStyles((theme: Theme) =>
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
    contentWrapper: {
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
