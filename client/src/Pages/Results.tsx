import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import ResultsTable from '../Components/ResultsTable';
import {Modal} from '../Components/Modal';
import {ResultDetails} from '../Components/ResultDetails';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {Result, ResultFacet, FilterValues} from '../../common/interfaces';
import {AppRoute} from '../enums';
import {createDataFromResult, Data} from '../Lib/TableHelpers';

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
    tableWrapper: {
      flex: 1,
      minHeight: 0,
      display: 'flex',
    },
  })
);

const endpointResults = '/api/results';
const endpointFacets = '/api/results/facets';
const pageSize = 50;

interface ResultFilterRequest {
  buildingTypeUid?: string;
  tags?: string[];
  scenario?: Record<string, string>;
  costMin?: number;
  costMax?: number;
  energyMin?: number;
  energyMax?: number;
  thermalDiscomfortMin?: number;
  thermalDiscomfortMax?: number;
  aqDiscomfortMin?: number;
  aqDiscomfortMax?: number;
  emissionsMin?: number;
  emissionsMax?: number;
}

interface FilterChangePayload {
  buildingTypeName: string;
  filters: FilterValues;
}

interface RouteParams {
  resultUid?: string;
}

export const Results: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const {resultUid} = useParams<RouteParams>();

  const [results, setResults] = useState<Result[]>([]);
  const [buildingFacets, setBuildingFacets] = useState<ResultFacet[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<Data | null>(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const filtersRef = React.useRef<ResultFilterRequest>({});
  const requestIdRef = React.useRef(0);
  // build out simple data fetcher straight in the useEffect for now
  const mergeResults = React.useCallback((current: Result[], incoming: Result[]) => {
    const existing = new Map(current.map(item => [item.uid, item]));
    incoming.forEach(item => {
      existing.set(item.uid, item);
    });
    return Array.from(existing.values()).sort(
      (a, b) => new Date(b.dateRun).getTime() - new Date(a.dateRun).getTime()
    );
  }, []);

  const serializeFilters = React.useCallback((filters: ResultFilterRequest) => {
    const params: Record<string, any> = {};
    if (filters.buildingTypeUid) {
      params.buildingTypeUid = filters.buildingTypeUid;
    }
    if (filters.tags && filters.tags.length > 0) {
      params.tags = filters.tags.join(',');
    }
    if (filters.scenario) {
      Object.entries(filters.scenario).forEach(([key, value]) => {
        if (value) {
          params[`scenario.${key}`] = value;
        }
      });
    }

    const assignRange = (
      minValue: number | undefined,
      maxValue: number | undefined,
      minKey: string,
      maxKey: string
    ) => {
      if (minValue !== undefined) {
        params[minKey] = minValue;
      }
      if (maxValue !== undefined) {
        params[maxKey] = maxValue;
      }
    };

    assignRange(filters.costMin, filters.costMax, 'costMin', 'costMax');
    assignRange(filters.energyMin, filters.energyMax, 'energyMin', 'energyMax');
    assignRange(
      filters.thermalDiscomfortMin,
      filters.thermalDiscomfortMax,
      'thermalDiscomfortMin',
      'thermalDiscomfortMax'
    );
    assignRange(filters.aqDiscomfortMin, filters.aqDiscomfortMax, 'aqDiscomfortMin', 'aqDiscomfortMax');
    assignRange(filters.emissionsMin, filters.emissionsMax, 'emissionsMin', 'emissionsMax');

    return params;
  }, []);

  const fetchResults = React.useCallback(
    async (cursor?: number, append = false, overrides?: ResultFilterRequest) => {
      if (append) {
        if (isLoadingMore) {
          return;
        }
      } else if (isLoadingResults && !overrides) {
        return;
      }

      const effectiveFilters = overrides ?? filtersRef.current;
      if (!append && overrides) {
        filtersRef.current = overrides;
      }

      const requestId = ++requestIdRef.current;
      append ? setIsLoadingMore(true) : setIsLoadingResults(true);

      try {
        const params: Record<string, any> = {
          limit: pageSize,
          ...serializeFilters(effectiveFilters),
        };
        if (cursor !== undefined) {
          params.cursor = cursor;
        }

        const response = await axios.get(endpointResults, {
          params,
        });

        const payload = response.data as {
          results: Result[];
          pageInfo: {
            hasNext: boolean;
            nextCursor: number | null;
          };
        };

        if (requestId !== requestIdRef.current) {
          return;
        }

        setResults(prev =>
          append ? mergeResults(prev, payload.results) : payload.results
        );
        setHasNext(payload.pageInfo?.hasNext ?? false);
        setNextCursor(payload.pageInfo?.nextCursor ?? null);
      } catch (err) {
        console.error('Unable to load shared results', err);
      } finally {
        append ? setIsLoadingMore(false) : setIsLoadingResults(false);
      }
    },
    [isLoadingResults, isLoadingMore, mergeResults, serializeFilters]
  );

  const initialLoadRef = React.useRef(false);

  useEffect(() => {
    if (initialLoadRef.current) {
      return;
    }
    initialLoadRef.current = true;

    fetchResults(undefined, false, filtersRef.current);

    axios.get(endpointFacets).then(response => {
      setBuildingFacets(response.data);
    });
  }, [fetchResults]);

  // when we get a selected result, show the result modal
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
  }, [resultUid, selectedResult, results, history]);

  const handleChange = (result: Data) => {
    setSelectedResult(result);
    if (result?.uid && result.uid !== resultUid) {
      history.push(`/result/${result.uid}`);
    }
  };

  const closeModal = () => {
    setShowResultModal(false);
    setSelectedResult(null);
    if (resultUid) {
      history.replace(AppRoute.Results);
    }
  };

  const handleLoadMore = () => {
    if (hasNext && nextCursor !== null) {
      fetchResults(nextCursor, true);
    }
  };

  const buildFilterRequest = React.useCallback(
    (payload: FilterChangePayload): ResultFilterRequest => {
      const request: ResultFilterRequest = {};

      if (payload.buildingTypeName) {
        const facet = buildingFacets.find(
          item => item.buildingTypeName === payload.buildingTypeName
        );
        if (facet) {
          request.buildingTypeUid = facet.buildingTypeUid;
        }
      }

      const scenarioEntries = Object.entries(payload.filters.scenario || {}).filter(
        ([, value]) => value !== undefined && value !== null && value !== ''
      );
      if (scenarioEntries.length > 0) {
        const scenarioObject: Record<string, string> = {};
        scenarioEntries.forEach(([key, value]) => {
          scenarioObject[key] = value;
        });
        request.scenario = scenarioObject;
      }

      if (payload.filters.tags && payload.filters.tags.length > 0) {
        request.tags = payload.filters.tags;
      }

      const assignRange = (
        range: {min: number; max: number} | undefined,
        minKey: keyof ResultFilterRequest,
        maxKey: keyof ResultFilterRequest
      ) => {
        if (!range) {
          return;
        }
        if (range.min !== undefined && range.min !== null) {
          request[minKey] = range.min;
        }
        if (range.max !== undefined && range.max !== null) {
          request[maxKey] = range.max;
        }
      };

      assignRange(payload.filters.cost, 'costMin', 'costMax');
      assignRange(payload.filters.energy, 'energyMin', 'energyMax');
      assignRange(
        payload.filters.thermalDiscomfort,
        'thermalDiscomfortMin',
        'thermalDiscomfortMax'
      );
      assignRange(payload.filters.aqDiscomfort, 'aqDiscomfortMin', 'aqDiscomfortMax');

      return request;
    },
    [buildingFacets]
  );

  const handleFiltersChange = React.useCallback(
    (payload: FilterChangePayload) => {
      const request = buildFilterRequest(payload);
      fetchResults(undefined, false, request);
    },
    [buildFilterRequest, fetchResults]
  );

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.tableWrapper}>
          <ResultsTable
            results={results}
            buildingFacets={buildingFacets}
            setSelectedResult={handleChange}
            isLoading={isLoadingResults && results.length === 0}
            onFiltersChange={handleFiltersChange}
            hasMoreResults={hasNext}
            onLoadMoreResults={handleLoadMore}
            isLoadingMoreResults={isLoadingMore}
          />
        </div>

        {showResultModal && selectedResult && (
          <Modal
            closeModal={closeModal}
            renderProp={<ResultDetails result={selectedResult} />}
          />
        )}
      </Paper>
    </div>
  );
};
