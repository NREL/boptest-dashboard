import {useCallback, useEffect, useMemo, useState} from 'react';
import axios, {AxiosError} from 'axios';

import {useUser} from '../../Context/user-context';
import {Result, ResultFacet} from '../../../../common/interfaces';
import {Data} from '../../Lib/TableHelpers';
import {useResultsApi} from '../../Lib/useResultsApi';
import {buildFilterRequest, FilterChangePayload} from '../../Lib/resultFilters';

export interface DashboardViewModel {
  results: Result[];
  buildingFacets: ResultFacet[];
  isLoadingResults: boolean;
  isLoadingMore: boolean;
  hasNext: boolean;
  loadMore: () => void;
  onFiltersChange: (payload: FilterChangePayload) => void;
  onResetFilters: () => void;
  error: string | null;
  errorTitle: string | null;
  showInitialSpinner: boolean;
  hasResults: boolean;
  isBusy: boolean;
  canRetry: boolean;
  handleRetry: () => void;
  onSelectResult: (result: Data) => void;
  selectedResult: Data | null;
  clearSelection: () => void;
  refresh: () => void;
  updateResultShareStatus: (uid: string, isShared: boolean) => void;
}

export const useDashboardViewModel = (): DashboardViewModel => {
  const {hashedIdentifier, authedId, loading: isUserLoading} = useUser();
  const [buildingFacets, setBuildingFacets] = useState<ResultFacet[]>([]);
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
      if (isAxiosError(err) && err.response?.status === 401) {
        setError('You must be logged in to view your results.');
        return;
      }
      setError('Unable to load your results. Please try again.');
    },
  });

  useEffect(() => {
    axios
      .get('/api/results/facets', {withCredentials: true})
      .then(response => {
        setBuildingFacets(response.data);
      })
      .catch(err => {
        console.error('Error fetching result facets:', err);
      });
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

  const onFiltersChange = useCallback(
    (payload: FilterChangePayload) => {
      const request = buildFilterRequest(payload, buildingFacets);
      applyFilters(request);
    },
    [applyFilters, buildingFacets]
  );

  const onResetFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const isBusy = isUserLoading || isLoadingResults;
  const showInitialSpinner = isBusy && results.length === 0;
  const hasResults = results.length > 0;
  const canRetry = Boolean(hashedIdentifier && authedId);

  const errorTitle = useMemo(() => {
    if (!error) {
      return null;
    }
    return error.toLowerCase().includes('logged in')
      ? 'Authentication Error'
      : 'Unable to Load Results';
  }, [error]);

  const handleRetry = useCallback(() => {
    if (!canRetry) {
      return;
    }
    setError(null);
    refresh();
  }, [canRetry, refresh]);

  const handleSelectResult = useCallback((result: Data) => {
    setSelectedResult(result);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedResult(null);
  }, []);

  const updateResultShareStatus = useCallback(
    (uid: string, share: boolean) => {
      setResults(prev =>
        prev.map(item =>
          item.uid === uid
            ? {
                ...item,
                isShared: share,
              }
            : item
        )
      );
      setSelectedResult(prev => {
        if (!prev || prev.uid !== uid) {
          return prev;
        }
        return {
          ...prev,
          isShared: share,
        };
      });
    },
    [setResults, setSelectedResult]
  );

  return {
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
    onSelectResult: handleSelectResult,
    selectedResult,
    clearSelection,
    refresh,
    updateResultShareStatus,
  };
};
  const isAxiosError = (error: unknown): error is AxiosError => {
    return (
      typeof error === 'object' &&
      error !== null &&
      'isAxiosError' in error
    );
  };
