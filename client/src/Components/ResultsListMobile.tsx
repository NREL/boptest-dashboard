import React, {useMemo, useState} from 'react';
import {
  Paper,
  Typography,
  CircularProgress,
  Tooltip,
  Button,
  IconButton,
} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import PublicIcon from '@material-ui/icons/Public';
import LockIcon from '@material-ui/icons/Lock';

import {Result} from '../../../common/interfaces';
import {createRows, Data} from '../Lib/TableHelpers';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1.5),
      padding: theme.spacing(1.5, 1.2, 2.5),
      flex: 1,
      overflowY: 'auto',
      width: '100%',
      backgroundColor: theme.palette.background.default,
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.25, 1, 2.25),
      },
    },
    stateWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing(2),
      padding: theme.spacing(4, 2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    card: {
      borderRadius: 16,
      padding: theme.spacing(2),
      background:
        theme.palette.type === 'dark'
          ? theme.palette.background.paper
          : theme.palette.background.default,
      boxShadow: '0 14px 32px rgba(15, 30, 84, 0.18)',
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1.5),
      color: theme.palette.text.primary,
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 120ms ease, box-shadow 120ms ease',
      '&:hover, &:focus-visible': {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
      },
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: theme.spacing(1.5),
    },
    titleColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
      minWidth: 0,
    },
    buildingName: {
      fontWeight: 600,
    },
    metaRow: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: theme.spacing(0.5),
      color: theme.palette.text.secondary,
      marginTop: theme.spacing(0.25),
    },
    submittedBy: {
      display: 'block',
    },
    metricScroll: {
      display: 'flex',
      gap: theme.spacing(1.5),
      marginTop: theme.spacing(1.5),
      overflowX: 'auto',
      paddingBottom: theme.spacing(0.5),
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      '&::after': {
        content: '""',
        minWidth: theme.spacing(0.5),
      },
    },
    metricTile: {
      flex: '0 0 140px',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.action.hover,
      borderRadius: 12,
      padding: theme.spacing(1.25, 1.5),
      minHeight: 72,
    },
    metricLabel: {
      fontSize: '0.75rem',
      color: theme.palette.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      marginBottom: theme.spacing(0.5),
    },
    metricValue: {
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums',
    },
    statusIcon: {
      display: 'flex',
      alignItems: 'center',
    },
    toggleButton: {
      padding: theme.spacing(0.5),
    },
    loadMoreWrapper: {
      paddingTop: theme.spacing(1),
      display: 'flex',
      justifyContent: 'center',
    },
  })
);

interface ResultsListMobileProps {
  results: Result[];
  onSelectResult: (result: Data) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  maxItems?: number;
  showShareStatus?: boolean;
  showAccountName?: boolean;
  onToggleShareStatus?: (result: Data, share: boolean) => Promise<void> | void;
}

const formatNumber = (value: number | undefined | null, fractionDigits = 2) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return '—';
  }
  return value.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

const formatWithUnit = (
  value: number | undefined | null,
  unit: string,
  fractionDigits = 2
) => {
  const formatted = formatNumber(value, fractionDigits);
  return formatted === '—' ? formatted : `${formatted} ${unit}`;
};

export const ResultsListMobile: React.FC<ResultsListMobileProps> = props => {
  const {
    results,
    onSelectResult,
    isLoading = false,
    hasMore = false,
    onLoadMore,
    isLoadingMore = false,
    maxItems,
    showShareStatus = true,
    showAccountName = false,
    onToggleShareStatus,
  } = props;

  const classes = useStyles();
  const dataRows = useMemo(() => createRows(results), [results]);
  const displayRows = typeof maxItems === 'number'
    ? dataRows.slice(0, maxItems)
    : dataRows;
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  const isUpdating = (uid: string) => updatingIds.has(uid);

  const handleStatusToggle = async (
    event: React.MouseEvent<HTMLButtonElement>,
    row: Data
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!onToggleShareStatus || isUpdating(row.uid)) {
      return;
    }

    const nextShared = !row.isShared;
    setUpdatingIds(prev => {
      const next = new Set(prev);
      next.add(row.uid);
      return next;
    });

    try {
      await onToggleShareStatus(row, nextShared);
    } catch (error) {
      console.error('Unable to toggle share status', error);
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);
        next.delete(row.uid);
        return next;
      });
    }
  };

  if (isLoading && dataRows.length === 0) {
    return (
      <div className={classes.stateWrapper}>
        <CircularProgress color="primary" size={28} />
        <Typography variant="body2">
          Loading your latest results...
        </Typography>
      </div>
    );
  }

  if (!isLoading && displayRows.length === 0) {
    return (
      <div className={classes.stateWrapper}>
        <Typography variant="subtitle1" gutterBottom>
          No results yet
        </Typography>
        <Typography variant="body2">
          Once you run a simulation, the most recent results will appear here.
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      {displayRows.map(row => {
        const dateString = new Date(row.dateRun).toLocaleString();
        return (
          <Paper
            key={row.uid}
            className={classes.card}
            elevation={0}
            role="button"
            tabIndex={0}
            onClick={() => onSelectResult(row)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelectResult(row);
              }
            }}
          >
            <div className={classes.cardHeader}>
              <div className={classes.titleColumn}>
                <Typography
                  variant="subtitle1"
                  className={classes.buildingName}
                  color="textPrimary"
                >
                  {row.buildingTypeName}
                </Typography>
                <div className={classes.metaRow}>
                  <Typography variant="body2" color="textSecondary">
                    {dateString}
                  </Typography>
                  {showAccountName && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className={classes.submittedBy}
                    >
                      Submitted by {row.accountUsername || 'Unknown user'}
                    </Typography>
                  )}
                </div>
              </div>
              {showShareStatus && (
                <div className={classes.statusIcon}>
                  <Tooltip
                    title={
                      row.isShared
                        ? 'Shared publicly'
                        : 'Private to your account'
                    }
                  >
                    <span>
                      <IconButton
                        size="small"
                        className={classes.toggleButton}
                        aria-label={row.isShared ? 'Make result private' : 'Share result publicly'}
                        aria-pressed={row.isShared}
                        onClick={event => handleStatusToggle(event, row)}
                        disabled={!onToggleShareStatus || isUpdating(row.uid)}
                      >
                        {isUpdating(row.uid) ? (
                          <CircularProgress size={16} thickness={5} />
                        ) : row.isShared ? (
                          <PublicIcon color="primary" fontSize="small" />
                        ) : (
                          <LockIcon color="disabled" fontSize="small" />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                </div>
              )}
            </div>

            <div className={classes.metricScroll}>
              {[
                {
                  label: 'Total Energy',
                  value: formatWithUnit(row.totalEnergy, 'kWh/m²'),
                },
                {
                  label: 'Thermal Discomfort',
                  value: formatWithUnit(row.thermalDiscomfort, 'Kh/zone'),
                },
                {
                  label: 'IAQ Discomfort',
                  value: formatWithUnit(row.aqDiscomfort, 'ppmh/zone'),
                },
                {
                  label: 'Operations Cost',
                  value: formatNumber(row.cost),
                },
                {
                  label: 'Time Ratio',
                  value: formatNumber(row.compTimeRatio ?? row.timeRatio),
                },
                {
                  label: 'Peak Electricity',
                  value: formatWithUnit(row.peakElectricity, 'kW/m²'),
                },
                {
                  label: 'Peak Gas',
                  value: formatWithUnit(row.peakGas, 'kW/m²'),
                },
                {
                  label: 'Peak District Heating',
                  value: formatWithUnit(row.peakDistrictHeating, 'kW/m²'),
                },
              ].map(metric => (
                <div className={classes.metricTile} key={metric.label}>
                  <span className={classes.metricLabel}>{metric.label}</span>
                  <span className={classes.metricValue}>{metric.value}</span>
                </div>
              ))}
            </div>
          </Paper>
        );
      })}

      {hasMore && onLoadMore && (
        <div className={classes.loadMoreWrapper}>
          <Button
            variant="outlined"
            color="primary"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Loading…' : 'Load more results'}
          </Button>
        </div>
      )}
    </div>
  );
};
