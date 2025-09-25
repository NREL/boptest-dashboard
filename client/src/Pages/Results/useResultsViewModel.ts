import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import axios from 'axios';
import {useHistory, useParams} from 'react-router-dom';

import {Result, ResultFacet} from '../../../../common/interfaces';
import {AppRoute} from '../../enums';
import {createDataFromResult, Data} from '../../Lib/TableHelpers';
import {useResultsApi} from '../../Lib/useResultsApi';
import {buildFilterRequest, FilterChangePayload} from '../../Lib/resultFilters';

const endpointResults = '/api/results';
const endpointFacets = '/api/results/facets';
const pageSize = 50;

interface RouteParams {
  resultUid?: string;
}

export interface ResultsViewModel {
  results: Result[];
  buildingFacets: ResultFacet[];
  isLoadingResults: boolean;
  isLoadingMore: boolean;
  hasNext: boolean;
  loadMore: () => void;
  onFiltersChange: (payload: FilterChangePayload) => void;
  onResetFilters: () => void;
  isInitialLoading: boolean;
  selectedResult: Data | null;
  handleSelectResult: (result: Data) => void;
  closeModal: () => void;
  showResultModal: boolean;
}

export const useResultsViewModel = (): ResultsViewModel => {
  const history = useHistory();
  const {resultUid} = useParams<RouteParams>();
  const [buildingFacets, setBuildingFacets] = useState<ResultFacet[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<Data | null>(null);

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
  } = useResultsApi({endpoint: endpointResults, pageSize});

  const initialLoadRef = useRef(false);

  useEffect(() => {
    if (initialLoadRef.current) {
      return;
    }
    initialLoadRef.current = true;

    refresh();

    axios.get(endpointFacets).then(response => {
      setBuildingFacets(response.data);
    });
  }, [refresh]);

  useEffect(() => {
    if (selectedResult !== null) {
      setShowResultModal(true);
    }
  }, [selectedResult]);

  useEffect(() => {
    if (!resultUid) {
      setSelectedResult(null);
      setShowResultModal(false);
    }
  }, [resultUid]);

  useEffect(() => {
    if (!resultUid) {
      setSelectedResult(null);
      setShowResultModal(false);
      return;
    }

    if (selectedResult && selectedResult.uid === resultUid) {
      setShowResultModal(true);
      return;
    }

    const existingResult = results.find(item => item.uid === resultUid);
    if (existingResult) {
      const dataRepresentation = createDataFromResult(existingResult);
      setSelectedResult(dataRepresentation);
      setShowResultModal(true);
      return;
    }

    axios
      .get(`/api/results/uid/${resultUid}`)
      .then(response => {
        const payload = response.data as Result;

        if (!payload.isShared) {
          setSelectedResult(null);
          setShowResultModal(false);
          history.replace(AppRoute.Results);
          return;
        }

        setResults(prev => {
          if (prev.some(item => item.uid === payload.uid)) {
            return prev;
          }
          return [...prev, payload];
        });

        const dataRepresentation = createDataFromResult(payload);
        setSelectedResult(dataRepresentation);
        setShowResultModal(true);
      })
      .catch(err => {
        console.error('Unable to load result by UID', err);
        setSelectedResult(null);
        setShowResultModal(false);
        history.replace(AppRoute.Results);
      });
  }, [resultUid, selectedResult, results, history, setResults]);

  const handleSelectResult = useCallback(
    (result: Data) => {
      setSelectedResult(result);
      if (result?.uid && result.uid !== resultUid) {
        history.push(`/result/${result.uid}`);
      }
    },
    [history, resultUid]
  );

  const closeModal = useCallback(() => {
    setShowResultModal(false);
    setSelectedResult(null);
    if (resultUid) {
      history.replace(AppRoute.Results);
    }
  }, [history, resultUid]);

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

  const isInitialLoading = useMemo(() => {
    return isLoadingResults && results.length === 0;
  }, [isLoadingResults, results.length]);

  return {
    results,
    buildingFacets,
    isLoadingResults,
    isLoadingMore,
    hasNext,
    loadMore,
    onFiltersChange,
    onResetFilters,
    isInitialLoading,
    selectedResult,
    handleSelectResult,
    closeModal,
    showResultModal,
  };
};
