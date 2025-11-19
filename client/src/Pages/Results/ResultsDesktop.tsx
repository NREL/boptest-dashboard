import React from 'react';
import Paper from '@material-ui/core/Paper';

import ResultsTable from '../../Components/ResultsTable';
import {Modal} from '../../Components/Modal';
import {ResultDetails} from '../../Components/ResultDetails';
import {useResultsLayoutStyles} from './resultsStyles';
import {useResultsViewModel} from './useResultsViewModel';

export const ResultsDesktop: React.FC = () => {
  const classes = useResultsLayoutStyles();
  const {
    results,
    buildingFacets,
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
  } = useResultsViewModel();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.contentWrapper}>
          <ResultsTable
            results={results}
            buildingFacets={buildingFacets}
            setSelectedResult={handleSelectResult}
            enableSelection
            showDownloadButton
            isLoading={isInitialLoading}
            onFiltersChange={onFiltersChange}
            hasMoreResults={hasNext}
            onLoadMoreResults={loadMore}
            isLoadingMoreResults={isLoadingMore}
            onResetFilters={onResetFilters}
          />
        </div>

        {showResultModal && selectedResult && (
          <Modal
            closeModal={closeModal}
            renderProp={
              <ResultDetails
                result={selectedResult}
                showShareStatus={false}
                onClose={closeModal}
              />
            }
          />
        )}
      </Paper>
    </div>
  );
};
