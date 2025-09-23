import React from 'react';
import Typography from '@material-ui/core/Typography';
import {Button, Menu, MenuItem, ListItemIcon, ListItemText} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {KPITable} from './KPITable';
import {ResultInfoTable} from './ResultInfoTable';
import {Result} from '../../common/interfaces';
import ShareIcon from '@material-ui/icons/Share';
import FileCopyIcon from '@material-ui/icons/FileCopy';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: 0,
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerText: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      minWidth: 0,
    },
    subheading: {
      color: 'rgba(0, 0, 0, 0.54)',
    },
    content: {
      flexGrow: 1,
    },
  })
);

interface ResultDetailsProps {
  result: Result;
}

export const ResultDetails: React.FC<ResultDetailsProps> = props => {
  const classes = useStyles();
  const canShare = props.result.isShared === true;
  const [shareAnchor, setShareAnchor] = React.useState<null | HTMLElement>(null);
  const canUseWebShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const copyLinkToClipboard = () => {
    const {origin} = window.location;
    const shareUrl = `${origin}/result/${props.result.uid}`;
    navigator.clipboard.writeText(shareUrl).catch(() => {
      // absorb copy errors silently
    });
  };

  const getShareUrl = () => {
    const {origin} = window.location;
    return `${origin}/result/${props.result.uid}`;
  };

  const openShareMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShareAnchor(event.currentTarget);
  };

  const closeShareMenu = () => {
    setShareAnchor(null);
  };

  const handleNativeShare = async () => {
    closeShareMenu();
    if (!canUseWebShare) {
      return;
    }

    const shareUrl = getShareUrl();
    try {
      await navigator.share({
        title: 'BOPTEST Result',
        text: `Check out this BOPTEST result for ${props.result.buildingTypeName}`,
        url: shareUrl,
      });
    } catch (error) {
      // ignore if the user cancels or sharing fails
    }
  };

  const handleCopyShareLink = () => {
    closeShareMenu();
    copyLinkToClipboard();
  };

  return (
    <div className={classes.root}>
      <div className={classes.headerRow}>
        <div className={classes.headerText}>
          <Typography variant="h6" noWrap>
            {`TESTCASE: ${props.result.buildingTypeName}`}
          </Typography>
          <Typography variant="body2" className={classes.subheading} noWrap>
            Result ID: {props.result.uid}
          </Typography>
        </div>
        {canShare && (
          <>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<ShareIcon />}
              onClick={openShareMenu}
            >
              Share
            </Button>
            <Menu
              anchorEl={shareAnchor}
              keepMounted
              open={Boolean(shareAnchor)}
              onClose={closeShareMenu}
            >
              {canUseWebShare && (
                <MenuItem onClick={handleNativeShare}>
                  <ListItemIcon>
                    <ShareIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Share with device" />
                </MenuItem>
              )}
              <MenuItem onClick={handleCopyShareLink}>
                <ListItemIcon>
                  <FileCopyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Copy link" />
              </MenuItem>
            </Menu>
          </>
        )}
      </div>
      <div className={classes.content}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <ResultInfoTable result={props.result} />
          </Grid>
          <Grid item xs={12} md={7}>
            <KPITable result={props.result} />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
