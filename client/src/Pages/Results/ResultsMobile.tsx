import React, {useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ShareIcon from '@material-ui/icons/Share';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CloseIcon from '@material-ui/icons/Close';
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
  const [shareAnchor, setShareAnchor] = useState<null | HTMLElement>(null);
  const canUseWebShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const leadingIcon = useMemo(() => <HomeIcon fontSize="small" />, []);

  useEffect(() => () => reset(), [reset]);

  const handleSelect = useCallback((result: Data) => {
    handleSelectResult(result);
  }, [handleSelectResult]);

  const handleCloseDetails = useCallback(() => {
    setShareAnchor(null);
    closeModal();
  }, [closeModal]);

  const handleOpenShareMenu = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setShareAnchor(event.currentTarget);
  }, []);

  const handleCloseShareMenu = useCallback(() => {
    setShareAnchor(null);
  }, []);

  const formatShareUrl = useCallback((result: Data) => {
    const {origin} = window.location;
    return `${origin}/result/${result.uid}`;
  }, []);

  const handleCopyShareLink = useCallback(
    (result: Data) => {
      handleCloseShareMenu();
      navigator.clipboard.writeText(formatShareUrl(result)).catch(() => {
        /* ignore clipboard failures */
      });
    },
    [formatShareUrl, handleCloseShareMenu]
  );

  const handleNativeShare = useCallback(
    async (result: Data) => {
      handleCloseShareMenu();
      if (!canUseWebShare) {
        return;
      }
      try {
        await navigator.share({
          title: 'BOPTEST Result',
          text: `Check out this BOPTEST result for ${result.buildingTypeName}`,
          url: formatShareUrl(result),
        });
      } catch (error) {
        /* ignore share cancellation */
      }
    },
    [canUseWebShare, formatShareUrl, handleCloseShareMenu]
  );

  const headerRightExtras = useMemo(() => {
    if (!selectedResult) {
      return null;
    }

    return (
      <div className={classes.detailHeaderActions}>
        {selectedResult.isShared ? (
          <>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={handleOpenShareMenu}
            >
              Share
            </Button>
            <Menu
              anchorEl={shareAnchor}
              keepMounted
              open={Boolean(shareAnchor)}
              onClose={handleCloseShareMenu}
            >
              {canUseWebShare ? (
                <MenuItem onClick={() => handleNativeShare(selectedResult)}>
                  <ListItemIcon>
                    <ShareIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Share with device" />
                </MenuItem>
              ) : null}
              <MenuItem onClick={() => handleCopyShareLink(selectedResult)}>
                <ListItemIcon>
                  <FileCopyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Copy link" />
              </MenuItem>
            </Menu>
          </>
        ) : null}
        <IconButton
          color="inherit"
          aria-label="Close details"
          onClick={handleCloseDetails}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </div>
    );
  }, [
    canUseWebShare,
    classes.detailHeaderActions,
    handleCloseDetails,
    handleCloseShareMenu,
    handleCopyShareLink,
    handleNativeShare,
    handleOpenShareMenu,
    selectedResult,
    shareAnchor,
  ]);

  useEffect(() => {
    if (selectedResult) {
      setOptions({
        leftAction: 'none',
        subtitle: `Result: ${selectedResult.uid}`,
        rightExtras: headerRightExtras,
        leadingIcon,
      });
      return;
    }

    setShareAnchor(null);
    setOptions({
      leftAction: 'none',
      subtitle: 'Latest Results',
      rightExtras: null,
      leadingIcon,
    });
  }, [headerRightExtras, leadingIcon, selectedResult, setOptions]);

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
