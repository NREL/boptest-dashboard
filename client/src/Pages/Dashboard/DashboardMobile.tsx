import React, {useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ShareIcon from '@material-ui/icons/Share';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import PublicIcon from '@material-ui/icons/Public';
import LockIcon from '@material-ui/icons/Lock';

import {ResultsListMobile} from '../../Components/ResultsListMobile';
import {ResultDetails} from '../../Components/ResultDetails';
import {useDashboardLayoutStyles} from './dashboardStyles';
import {useDashboardViewModel} from './useDashboardViewModel';
import {Data} from '../../Lib/TableHelpers';
import {useMobileHeader} from '../../NavBar/MobileHeaderContext';

export const DashboardMobile: React.FC = () => {
  const classes = useDashboardLayoutStyles();
  const {
    results,
    isLoadingResults,
    isLoadingMore,
    hasNext,
    loadMore,
    error,
    errorTitle,
    showInitialSpinner,
    hasResults,
    isBusy,
    canRetry,
    handleRetry,
    onSelectResult,
    selectedResult,
    clearSelection,
  } = useDashboardViewModel();
  const {setOptions, reset} = useMobileHeader();
  const [shareAnchor, setShareAnchor] = useState<null | HTMLElement>(null);

  const canUseWebShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleSelect = (result: Data) => {
    onSelectResult(result);
  };

  const handleCloseDetails = useCallback(() => {
    setShareAnchor(null);
    clearSelection();
  }, [clearSelection]);

  const handleOpenShareMenu = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setShareAnchor(event.currentTarget);
  }, []);

  const handleCloseShareMenu = useCallback(() => {
    setShareAnchor(null);
  }, []);

  const formatShareUrl = useCallback((result: Data) => {
    const {origin} = window.location;
    return `${origin}/result/${result.uid}`;
  }, []);

  const handleCopyShareLink = useCallback(
    (result: Data) => {
      handleCloseShareMenu();
      navigator.clipboard.writeText(formatShareUrl(result)).catch(() => {
        // ignore clipboard failures on mobile completely
      });
    },
    [formatShareUrl, handleCloseShareMenu]
  );

  const handleNativeShare = useCallback(
    async (result: Data) => {
      handleCloseShareMenu();
      if (!canUseWebShare) {
        return;
      }
      try {
        await navigator.share({
          title: 'BOPTEST Result',
          text: `Check out this BOPTEST result for ${result.buildingTypeName}`,
          url: formatShareUrl(result),
        });
      } catch (error) {
        // ignore share cancellation/errors
      }
    },
    [canUseWebShare, formatShareUrl, handleCloseShareMenu]
  );

  const headerRightExtras = useMemo(() => {
    if (!selectedResult || selectedResult.isShared !== true) {
      return null;
    }

    return (
      <>
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          onClick={handleOpenShareMenu}
          className={classes.headerShareButton}
        >
          Share
        </Button>
        <Menu
          anchorEl={shareAnchor}
          keepMounted
          open={Boolean(shareAnchor)}
          onClose={handleCloseShareMenu}
        >
          {canUseWebShare ? (
            <MenuItem onClick={() => handleNativeShare(selectedResult)}>
              <ListItemIcon>
                <ShareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Share with device" />
            </MenuItem>
          ) : null}
          <MenuItem onClick={() => handleCopyShareLink(selectedResult)}>
            <ListItemIcon>
              <FileCopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Copy link" />
          </MenuItem>
        </Menu>
      </>
    );
  }, [
    canUseWebShare,
    handleCloseShareMenu,
    handleCopyShareLink,
    handleNativeShare,
    handleOpenShareMenu,
    selectedResult,
    shareAnchor,
  ]);

  useEffect(() => {
    if (selectedResult) {
      const statusLabel = selectedResult.isShared
        ? 'Shared publicly'
        : 'Private result';
      setOptions({
        leftAction: 'back',
        onBack: handleCloseDetails,
        title: `Test Case: ${selectedResult.buildingTypeName}`,
        subtitle: `Result ID: ${selectedResult.uid}`,
        status: {
          icon: selectedResult.isShared ? (
            <PublicIcon fontSize="small" />
          ) : (
            <LockIcon fontSize="small" />
          ),
          label: statusLabel,
        },
        rightExtras: headerRightExtras,
        hideAuthControl: true,
      });
      return;
    }
    setOptions({
      leftAction: 'none',
      title: 'My Results',
      subtitle: 'Results for this account.',
      rightExtras: null,
      hideAuthControl: false,
    });
  }, [
    handleCloseDetails,
    headerRightExtras,
    selectedResult,
    setOptions,
  ]);

  useEffect(() => () => reset(), [reset]);

  return (
    <div className={classes.root}>
      <Paper className={clsx(classes.paper, classes.paperMobile)} elevation={0}>
        {selectedResult ? (
          <ResultDetails
            result={selectedResult}
            onClose={handleCloseDetails}
            showMobileHeader={false}
          />
        ) : (
          <>
            {error ? (
              <Paper elevation={0} className={classes.statusContainer}>
                <Typography variant="h6" color="error" gutterBottom>
                  {errorTitle}
                </Typography>
                <Typography variant="body1" paragraph>
                  {error}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRetry}
                  disabled={!canRetry || isBusy}
                >
                  Try Again
                </Button>
              </Paper>
            ) : showInitialSpinner ? (
              <Paper elevation={0} className={classes.statusContainer}>
                <CircularProgress color="primary" />
              </Paper>
            ) : !hasResults ? (
              <Paper elevation={0} className={classes.statusContainer}>
                <Typography variant="body1">
                  You don't have any test results yet.
                </Typography>
              </Paper>
            ) : (
              <div className={classes.mobileListWrapper}>
                <ResultsListMobile
                  results={results}
                  onSelectResult={handleSelect}
                  isLoading={isLoadingResults && results.length === 0}
                  hasMore={hasNext}
                  onLoadMore={loadMore}
                  isLoadingMore={isLoadingMore}
                />
              </div>
            )}
          </>
        )}
      </Paper>
    </div>
  );
};
