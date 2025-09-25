import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import ResultsTable from '../../Components/ResultsTable';
import {Modal} from '../../Components/Modal';
import {ResultDetails} from '../../Components/ResultDetails';
import {useDashboardLayoutStyles} from './dashboardStyles';
import {useDashboardViewModel} from './useDashboardViewModel';
import {Data} from '../../Lib/TableHelpers';

export const DashboardDesktop: React.FC = () => {
  const classes = useDashboardLayoutStyles();
  const {
    results,
    buildingFacets,
    isLoadingResults,
    isLoadingMore,
    hasNext,
    loadMore,
    onFiltersChange,
    onResetFilters,
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
    refresh,
  } = useDashboardViewModel();

  const handleSelect = (result: Data) => {
    onSelectResult(result);
  };

  const handleModalClose = () => {
    clearSelection();
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={0}>
        <Typography variant="h5" className={classes.header}>
          My Results
        </Typography>
        <Typography variant="body2" className={classes.subheader}>
          Results for this account.
        </Typography>
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
          <>
            <div className={classes.tableWrapper}>
              <ResultsTable
                results={results}
                buildingFacets={buildingFacets}
                setSelectedResult={handleSelect}
                enableSelection
                enableShareToggle
                showDownloadButton
                onShareToggleComplete={refresh}
                isLoading={isLoadingResults && results.length === 0}
                onFiltersChange={onFiltersChange}
                hasMoreResults={hasNext}
                onLoadMoreResults={loadMore}
                isLoadingMoreResults={isLoadingMore}
                onResetFilters={onResetFilters}
              />
            </div>
            {selectedResult && (
              <Modal
                closeModal={handleModalClose}
                renderProp={
                  <ResultDetails result={selectedResult} onClose={handleModalClose} />
                }
              />
            )}
          </>
        )}
      </Paper>
    </div>
  );
};
