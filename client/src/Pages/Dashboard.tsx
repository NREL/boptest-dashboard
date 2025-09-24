import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import {useUser} from '../Context/user-context';
import {makeStyles, createStyles, Theme, useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import ResultsTable from '../Components/ResultsTable';
import {Modal} from '../Components/Modal';
import {ResultDetails} from '../Components/ResultDetails';
import {ResultFacet} from '../../common/interfaces';
import {Data} from '../Lib/TableHelpers';
import {useResultsApi} from '../Lib/useResultsApi';
import {buildFilterRequest, FilterChangePayload} from '../Lib/resultFilters';
import {ResultsListMobile} from '../Components/ResultsListMobile';

const useStyles = makeStyles((theme: Theme) =>
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
    noResults: {
      padding: theme.spacing(5),
      textAlign: 'center',
      backgroundColor: 'transparent',
    },
    header: {
      padding: theme.spacing(3, 3, 1.5),
    },
    subheader: {
      padding: theme.spacing(0, 3, 2),
      color: theme.palette.text.secondary,
    },
    tableWrapper: {
      flex: 1,
      minHeight: 0,
      display: 'flex',
    },
  })
);

export const Dashboard: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {hashedIdentifier, authedId, loading: isUserLoading} = useUser();
  const [buildingFacets, setBuildingFacets] = useState<ResultFacet[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    results,
    setResults,
    isLoading: isLoadingResults,
    isLoadingMore,
    hasNext,
    loadMore,
    applyFilters,
    resetFilters,
    refresh,
  } = useResultsApi({
    endpoint: '/api/results/my-results',
    pageSize: 200,
    withCredentials: true,
    onError: err => {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('You must be logged in to view your results.');
        return;
      }
      setError('Unable to load your results. Please try again.');
    },
  });

  const updateBuildingFacets = () => {
    axios.get('/api/results/facets', {
      withCredentials: true // Include cookies in the request
    })
    .then(response => {
      setBuildingFacets(response.data);
    })
    .catch(err => {
      console.error('Error fetching result facets:', err);
    });
  };

  useEffect(() => {
    updateBuildingFacets();
  }, []);

  useEffect(() => {
    if (isUserLoading) {
      return;
    }

    if (!hashedIdentifier || !authedId) {
      setResults([]);
      setError('You must be logged in to view your results.');
      return;
    }

    setError(null);
    refresh();
  }, [authedId, hashedIdentifier, isUserLoading, refresh, setResults]);

  // when we get a selected result, show the result modal
  useEffect(() => {
    if (selectedResult !== null) {
      setShowResultModal(true);
    }
  }, [selectedResult]);

  const handleChange = (result: Data) => {
    setSelectedResult(result);
  };

  const closeModal = () => setShowResultModal(false);

  // Handle toggle change

  const isBusy = isUserLoading || isLoadingResults;
  const showInitialSpinner = isBusy && results.length === 0;
  const hasResults = results.length > 0;
  const canRetry = Boolean(hashedIdentifier && authedId);
  const errorTitle = error && error.toLowerCase().includes('logged in')
    ? 'Authentication Error'
    : 'Unable to Load Results';

  const handleFiltersChange = useCallback(
    (payload: FilterChangePayload) => {
      const request = buildFilterRequest(payload, buildingFacets);
      applyFilters(request);
    },
    [applyFilters, buildingFacets]
  );

  const handleResetFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  return (
    <div className={classes.root}>
      <Paper className={clsx(classes.paper, isMobile && classes.paperMobile)} elevation={isMobile ? 0 : undefined}>
        <Typography variant="h5" className={classes.header}>
          My Results
        </Typography>
        <Typography variant="body2" className={classes.subheader}>
          Results for this account.
        </Typography>
        {error ? (
          <Paper elevation={0} className={classes.noResults}>
            <Typography variant="h6" color="error" gutterBottom>
              {errorTitle}
            </Typography>
            <Typography variant="body1" paragraph>
              {error}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (!canRetry) {
                  return;
                }
                setError(null);
                refresh();
              }}
              disabled={!canRetry || isBusy}
            >
              Try Again
            </Button>
          </Paper>
        ) : showInitialSpinner ? (
          <Paper elevation={0} className={classes.noResults}>
            <CircularProgress color="primary" />
          </Paper>
        ) : !hasResults ? (
          <Paper elevation={0} className={classes.noResults}>
            <Typography variant="body1">
              You don't have any test results yet.
            </Typography>
          </Paper>
        ) : isMobile ? (
          <div className={classes.tableWrapper}>
            <ResultsListMobile
              results={results}
              onSelectResult={handleChange}
              isLoading={isLoadingResults && results.length === 0}
              hasMore={hasNext}
              onLoadMore={loadMore}
              isLoadingMore={isLoadingMore}
            />
          </div>
        ) : (
          <>
            <div className={classes.tableWrapper}>
              <ResultsTable
                results={results}
                buildingFacets={buildingFacets}
                setSelectedResult={handleChange}
                enableSelection
                enableShareToggle
                showDownloadButton
                onShareToggleComplete={refresh}
                isLoading={isLoadingResults && results.length === 0}
                onFiltersChange={handleFiltersChange}
                hasMoreResults={hasNext}
                onLoadMoreResults={loadMore}
                isLoadingMoreResults={isLoadingMore}
                onResetFilters={handleResetFilters}
              />
            </div>
            {showResultModal && selectedResult && (
              <Modal
                closeModal={closeModal}
                renderProp={
                  <ResultDetails result={selectedResult} onClose={closeModal} />
                }
              />
            )}
          </>
        )}
      </Paper>
    </div>
  );
};
