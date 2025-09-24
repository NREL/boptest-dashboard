import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import ResultsTable from '../Components/ResultsTable';
import {Modal} from '../Components/Modal';
import {ResultDetails} from '../Components/ResultDetails';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {Result, ResultFacet} from '../../common/interfaces';
import {AppRoute} from '../enums';
import {createDataFromResult, Data} from '../Lib/TableHelpers';
import {useResultsApi} from '../Lib/useResultsApi';
import {buildFilterRequest, FilterChangePayload} from '../Lib/resultFilters';

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

interface RouteParams {
  resultUid?: string;
}

export const Results: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const {resultUid} = useParams<RouteParams>();

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
  const [buildingFacets, setBuildingFacets] = useState<ResultFacet[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<Data | null>(null);
  // build out simple data fetcher straight in the useEffect for now
  const initialLoadRef = React.useRef(false);

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
    loadMore();
  };

  const handleFiltersChange = React.useCallback(
    (payload: FilterChangePayload) => {
      const request = buildFilterRequest(payload, buildingFacets);
      applyFilters(request);
    },
    [applyFilters, buildingFacets]
  );

  const handleResetFilters = React.useCallback(() => {
    resetFilters();
  }, [resetFilters]);

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
            onResetFilters={handleResetFilters}
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
