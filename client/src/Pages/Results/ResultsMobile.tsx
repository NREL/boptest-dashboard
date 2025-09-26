import React, {useCallback, useEffect, useMemo} from 'react';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AssessmentIcon from '@material-ui/icons/Assessment';
import HomeIcon from '@material-ui/icons/Home';

import {ResultsListMobile} from '../../Components/ResultsListMobile';
import {ResultDetails} from '../../Components/ResultDetails';
import {useResultsLayoutStyles} from './resultsStyles';
import {useResultsViewModel} from './useResultsViewModel';
import {useMobileHeader} from '../../NavBar/MobileHeaderContext';
import {Data} from '../../Lib/TableHelpers';

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
  } = useResultsViewModel();
  const {setOptions, reset} = useMobileHeader();
  const listIcon = useMemo(() => <HomeIcon fontSize="small" />, []);
  const detailIcon = useMemo(() => <AssessmentIcon fontSize="small" />, []);

  useEffect(() => () => reset(), [reset]);

  const handleSelect = useCallback((result: Data) => {
    handleSelectResult(result);
  }, [handleSelectResult]);

  const handleCloseDetails = useCallback(() => {
    closeModal();
  }, [closeModal]);

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
      subtitle: 'Latest Results',
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
            showShareStatus={false}
            onClose={handleCloseDetails}
            showMobileHeader={false}
          />
        ) : (
          <div className={classes.contentWrapper}>
            <ResultsListMobile
              results={results}
              onSelectResult={handleSelect}
              isLoading={isInitialLoading}
              hasMore={hasNext}
              onLoadMore={loadMore}
              isLoadingMore={isLoadingMore}
              showShareStatus={false}
              showAccountName
            />
          </div>
        )}
      </Paper>
    </div>
  );
};
