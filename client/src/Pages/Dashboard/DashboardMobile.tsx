import React, {useCallback, useEffect, useMemo} from 'react';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssignmentIcon from '@material-ui/icons/Assignment';

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
    updateResultShareStatus,
  } = useDashboardViewModel();
  const {setOptions, reset} = useMobileHeader();
  const listIcon = useMemo(() => <DashboardIcon fontSize="small" />, []);
  const detailIcon = useMemo(() => <AssignmentIcon fontSize="small" />, []);

  useEffect(() => () => reset(), [reset]);

  const handleSelect = useCallback((result: Data) => {
    onSelectResult(result);
  }, [onSelectResult]);

  const handleCloseDetails = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  const headerRightExtras = useMemo(() => {
    if (!selectedResult) {
      return null;
    }

    return (
      <div className={classes.detailHeaderActions}>
        <IconButton
          color="inherit"
          aria-label="Go back"
          onClick={handleCloseDetails}
          size="small"
        >
          <ArrowBackIcon />
        </IconButton>
      </div>
    );
  }, [classes.detailHeaderActions, handleCloseDetails, selectedResult]);

  const handleShareStatusChange = useCallback(
    (share: boolean) => {
      if (!selectedResult) {
        return;
      }
      updateResultShareStatus(selectedResult.uid, share);
    },
    [selectedResult, updateResultShareStatus]
  );

  useEffect(() => {
    if (selectedResult) {
      setOptions({
        leftAction: 'none',
        subtitle: selectedResult.buildingTypeName ?? 'Result',
        rightExtras: headerRightExtras,
        leadingIcon: detailIcon,
      });
      return;
    }

    setOptions({
      leftAction: 'none',
      subtitle: 'My Results',
      rightExtras: null,
      leadingIcon: listIcon,
    });
  }, [detailIcon, headerRightExtras, listIcon, selectedResult, setOptions]);

  return (
    <div className={classes.root}>
      <Paper className={clsx(classes.paper, classes.paperMobile)} elevation={0}>
        {selectedResult ? (
          <ResultDetails
            result={selectedResult}
            onClose={handleCloseDetails}
            showMobileHeader={false}
            onShareStatusChange={handleShareStatusChange}
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
