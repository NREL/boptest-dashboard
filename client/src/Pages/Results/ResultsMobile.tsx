import React from 'react';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';

import {ResultsListMobile} from '../../Components/ResultsListMobile';
import {Modal} from '../../Components/Modal';
import {ResultDetails} from '../../Components/ResultDetails';
import {useResultsLayoutStyles} from './resultsStyles';
import {useResultsViewModel} from './useResultsViewModel';

export const ResultsMobile: React.FC = () => {
  const classes = useResultsLayoutStyles();
  const {
    results,
    isLoadingMore,
    hasNext,
    loadMore,
    isInitialLoading,
    selectedResult,
    handleSelectResult,
    closeModal,
    showResultModal,
  } = useResultsViewModel();

  return (
    <div className={classes.root}>
      <Paper className={clsx(classes.paper, classes.paperMobile)} elevation={0}>
        <div className={classes.contentWrapper}>
          <ResultsListMobile
            results={results}
            onSelectResult={handleSelectResult}
            isLoading={isInitialLoading}
            hasMore={hasNext}
            onLoadMore={loadMore}
            isLoadingMore={isLoadingMore}
            showShareStatus={false}
            showAccountName
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
