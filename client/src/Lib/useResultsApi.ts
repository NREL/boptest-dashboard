import {useCallback, useRef, useState} from 'react';
import axios, {AxiosRequestConfig, CancelTokenSource} from 'axios';

import {Result} from '../../common/interfaces';
import {ResultFilterRequest} from './resultFilters';

interface UseResultsApiOptions {
  endpoint: string;
  pageSize?: number;
  withCredentials?: boolean;
  onError?: (error: unknown) => void;
}

interface FetchParams {
  cursor?: number;
  append?: boolean;
  filters?: ResultFilterRequest;
}

interface ResultsPagePayload {
  results: Result[];
  pageInfo?: {
    hasNext?: boolean;
    nextCursor?: number | null;
  };
}

const defaultPageSize = 50;

const serializeFilters = (filters: ResultFilterRequest) => {
  const params: Record<string, any> = {};

  if (filters.buildingTypeUid) {
    params.buildingTypeUid = filters.buildingTypeUid;
  }
  if (filters.buildingTypeName) {
    params.buildingTypeName = filters.buildingTypeName;
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
};

const mergeResults = (current: Result[], incoming: Result[]) => {
  const existing = new Map(current.map(item => [item.uid, item]));
  incoming.forEach(item => {
    existing.set(item.uid, item);
  });
  return Array.from(existing.values()).sort(
    (a, b) => new Date(b.dateRun).getTime() - new Date(a.dateRun).getTime()
  );
};

export const useResultsApi = (options: UseResultsApiOptions) => {
  const {endpoint, pageSize = defaultPageSize, withCredentials = false, onError} = options;

  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);

  const filtersRef = useRef<ResultFilterRequest>({});
  const requestIdRef = useRef(0);
  const cancelSourceRef = useRef<CancelTokenSource | null>(null);

  const fetchResults = useCallback(
    async (fetchParams: FetchParams = {}) => {
      const {cursor, append = false, filters} = fetchParams;

      if (append) {
        if (isLoadingMore) {
          return;
        }
      } else if (isLoading && !filters) {
        return;
      }

      const effectiveFilters = filters ?? filtersRef.current;
      if (!append && filters) {
        filtersRef.current = filters;
      }

      const requestId = ++requestIdRef.current;
      if (cancelSourceRef.current) {
        cancelSourceRef.current.cancel();
      }
      const cancelSource = axios.CancelToken.source();
      cancelSourceRef.current = cancelSource;
      append ? setIsLoadingMore(true) : setIsLoading(true);

      try {
        const params: Record<string, any> = {
          limit: pageSize,
          ...serializeFilters(effectiveFilters),
        };

        if (process.env.NODE_ENV !== 'production' && filters) {
          console.log('fetchResults filters', filters);
        }

        if (cursor !== undefined) {
          params.cursor = cursor;
        }

        const config: AxiosRequestConfig = {
          params,
          cancelToken: cancelSource.token,
        };

        if (withCredentials) {
          config.withCredentials = true;
        }

        const response = await axios.get<ResultsPagePayload>(endpoint, config);
        const payload = response.data;

        if (requestId !== requestIdRef.current) {
          return;
        }

        const incomingResults = payload.results ?? [];
        setResults(prev => (append ? mergeResults(prev, incomingResults) : incomingResults));
        const pageInfo = payload.pageInfo ?? {};
        setHasNext(Boolean(pageInfo.hasNext));
        setNextCursor(pageInfo.nextCursor ?? null);
      } catch (err) {
        if (axios.isCancel(err)) {
          return;
        }
        console.error('Unable to load results', err);
        onError?.(err);
        if (!append) {
          setResults([]);
          setHasNext(false);
          setNextCursor(null);
        }
      } finally {
        if (cancelSourceRef.current === cancelSource) {
          cancelSourceRef.current = null;
        }
        append ? setIsLoadingMore(false) : setIsLoading(false);
      }
    },
    [endpoint, isLoading, isLoadingMore, onError, pageSize, withCredentials]
  );

  const loadMore = useCallback(() => {
    if (!hasNext || nextCursor === null) {
      return;
    }
    fetchResults({cursor: nextCursor, append: true});
  }, [fetchResults, hasNext, nextCursor]);

  const applyFilters = useCallback(
    (request: ResultFilterRequest) => {
      fetchResults({filters: request, append: false});
    },
    [fetchResults]
  );

  const resetFilters = useCallback(() => {
    fetchResults({filters: {}, append: false});
  }, [fetchResults]);

  const refresh = useCallback(() => {
    fetchResults({append: false});
  }, [fetchResults]);

  return {
    results,
    setResults,
    isLoading,
    isLoadingMore,
    hasNext,
    loadMore,
    applyFilters,
    resetFilters,
    refresh,
  };
};

export type UseResultsApiReturn = ReturnType<typeof useResultsApi>;
