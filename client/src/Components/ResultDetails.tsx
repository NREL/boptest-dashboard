import React from 'react';
import Typography from '@material-ui/core/Typography';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Chip,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {createStyles, makeStyles, useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Tooltip from '@material-ui/core/Tooltip';
import {KPITable} from './KPITable';
import {ResultInfoTable} from './ResultInfoTable';
import {Data} from '../Lib/TableHelpers';
import ShareIcon from '@material-ui/icons/Share';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import PublicIcon from '@material-ui/icons/Public';
import LockIcon from '@material-ui/icons/Lock';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxSizing: 'border-box',
      padding: 0,
      flex: 1,
      minHeight: 0,
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: theme.spacing(1.5),
      marginBottom: 16,
      padding: theme.spacing(2, 2.25, 1.5),
      borderBottom: 'none',
      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      position: 'sticky',
      top: 0,
      zIndex: 1,
      color: theme.palette.primary.contrastText,
      margin: theme.spacing(-2, -1.5, 0),
      [theme.breakpoints.down('sm')]: {
        margin: theme.spacing(-1.5, -1, 0),
      },
    },
    headerText: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      minWidth: 0,
      flex: 1,
      color: theme.palette.primary.contrastText,
      '& h6': {
        color: theme.palette.primary.contrastText,
      },
      '& span': {
        color: theme.palette.primary.contrastText,
      },
    },
    subheading: {
      color: 'rgba(255, 255, 255, 0.75)',
    },
    content: {
      flexGrow: 1,
      overflowY: 'auto',
      padding: theme.spacing(1.75, 1.5, 2.25),
      minHeight: 0,
      boxSizing: 'border-box',
      backgroundColor: theme.palette.background.default,
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.25, 1, 1.75),
      },
    },
    footerBar: {
      margin: theme.spacing(0, -1.5, -1.5),
      padding: theme.spacing(1.5, 1.5),
      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
      color: theme.palette.primary.contrastText,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      fontSize: '0.75rem',
      [theme.breakpoints.down('sm')]: {
        margin: theme.spacing(0, -1, -1),
        padding: theme.spacing(1.25, 1.25),
        fontSize: '0.7rem',
      },
    },
    headerActions: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      marginLeft: 'auto',
      flexWrap: 'wrap',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        justifyContent: 'space-between',
      },
    },
    shareButton: {
      whiteSpace: 'nowrap',
      color: theme.palette.primary.contrastText,
      backgroundColor: 'rgba(255,255,255,0.18)',
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.28)',
        boxShadow: 'none',
      },
    },
    closeButton: {
      marginLeft: 'auto',
      color: theme.palette.primary.contrastText,
      padding: theme.spacing(0.5),
    },
    mobileContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      padding: '0 8px 24px',
    },
    mobileStatusRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      color: 'rgba(0, 0, 0, 0.54)',
    },
    mobileSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
      padding: '16px 16px 18px',
      borderRadius: 12,
    },
    mobileSectionTitle: {
      fontWeight: 600,
      textTransform: 'uppercase',
      fontSize: '0.75rem',
      letterSpacing: 0.6,
      color: 'rgba(0, 0, 0, 0.54)',
    },
    mobileRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
    mobileLabel: {
      fontSize: '0.75rem',
      color: 'rgba(0, 0, 0, 0.54)',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    mobileValue: {
      fontWeight: 500,
    },
    mobileMetricGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: 12,
    },
    mobileMetricTile: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      backgroundColor: '#fff',
      padding: '12px 14px',
      borderRadius: 10,
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
    },
    mobileMetricLabel: {
      fontSize: '0.75rem',
      color: 'rgba(0, 0, 0, 0.54)',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    mobileMetricValue: {
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums',
    },
    tagContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
    },
  })
);

interface ResultDetailsProps {
  result: Data;
  showShareStatus?: boolean;
  onClose?: () => void;
}

export const ResultDetails: React.FC<ResultDetailsProps> = props => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {result, showShareStatus = true, onClose} = props;
  const canShare = result.isShared === true;
  const [shareAnchor, setShareAnchor] = React.useState<null | HTMLElement>(null);
  const canUseWebShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const copyLinkToClipboard = () => {
    const {origin} = window.location;
    const shareUrl = `${origin}/result/${result.uid}`;
    navigator.clipboard.writeText(shareUrl).catch(() => {
      // absorb copy errors silently
    });
  };

  const getShareUrl = () => {
    const {origin} = window.location;
    return `${origin}/result/${result.uid}`;
  };

  const openShareMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShareAnchor(event.currentTarget);
  };

  const closeShareMenu = () => {
    setShareAnchor(null);
  };

  const handleNativeShare = async () => {
    closeShareMenu();
    if (!canUseWebShare) {
      return;
    }

    const shareUrl = getShareUrl();
    try {
      await navigator.share({
        title: 'BOPTEST Result',
        text: `Check out this BOPTEST result for ${result.buildingTypeName}`,
        url: shareUrl,
      });
    } catch (error) {
      // ignore if the user cancels or sharing fails
    }
  };

  const handleCopyShareLink = () => {
    closeShareMenu();
    copyLinkToClipboard();
  };

  const dateString = new Date(result.dateRun).toLocaleString();
  const statusLabel = result.isShared
    ? 'Shared publicly'
    : 'Private result';

  const formatNumber = (value: number | undefined | null, fractionDigits = 2) => {
    if (value === undefined || value === null || Number.isNaN(value)) {
      return '—';
    }
    return value.toLocaleString(undefined, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
  };

  const mobileMetrics = [
    {
      label: 'Total Energy',
      value: `${formatNumber(result.totalEnergy)} kWh/m²`,
    },
    {
      label: 'Thermal Discomfort',
      value: `${formatNumber(result.thermalDiscomfort)} Kh/zone`,
    },
    {
      label: 'IAQ Discomfort',
      value: `${formatNumber(result.aqDiscomfort)} ppmh/zone`,
    },
    {
      label: 'Operations Cost',
      value: formatNumber(result.cost),
    },
    {
      label: 'CO₂ Emissions',
      value: `${formatNumber(result.emissions)} kgCO₂/m²`,
    },
    {
      label: 'Comp Time Ratio',
      value: formatNumber(result.compTimeRatio),
    },
    {
      label: 'Peak Electricity',
      value: `${formatNumber(result.peakElectricity)} kW/m²`,
    },
    result.peakGas !== null && result.peakGas !== undefined
      ? {
          label: 'Peak Gas',
          value: `${formatNumber(result.peakGas)} kW/m²`,
        }
      : null,
    result.peakDistrictHeating !== null &&
    result.peakDistrictHeating !== undefined
      ? {
          label: 'Peak District Heat',
          value: `${formatNumber(result.peakDistrictHeating)} kW/m²`,
        }
      : null,
  ].filter(
    (metric): metric is {label: string; value: string} =>
      Boolean(
        metric &&
          metric.value &&
          !metric.value.trim().startsWith('—')
      )
  );

  const mobileScenarioEntries = [
    {label: 'Time Period', value: result.timePeriod},
    {label: 'Electricity Price', value: result.electricityPrice},
    {
      label: 'Forecast Uncertainty',
      value: result.weatherForecastUncertainty,
    },
  ].filter(entry => entry.value);

  return (
    <div className={classes.root}>
      <div className={classes.headerRow}>
        <div className={classes.headerText}>
          <Typography variant="h6" noWrap={!isMobile}>
            {`TEST CASE: ${result.buildingTypeName}`}
          </Typography>
          <Typography
            variant="body2"
            className={classes.subheading}
            noWrap={!isMobile}
          >
            Result ID: {result.uid}
          </Typography>
        </div>
        <div className={classes.headerActions}>
          {canShare && (
            <>
              <Button
                size="small"
                variant="contained"
                color="primary"
                startIcon={<ShareIcon />}
                onClick={openShareMenu}
                className={classes.shareButton}
              >
                Share
              </Button>
              <Menu
                anchorEl={shareAnchor}
                keepMounted
                open={Boolean(shareAnchor)}
                onClose={closeShareMenu}
              >
                {canUseWebShare && (
                  <MenuItem onClick={handleNativeShare}>
                    <ListItemIcon>
                      <ShareIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Share with device" />
                  </MenuItem>
                )}
                <MenuItem onClick={handleCopyShareLink}>
                  <ListItemIcon>
                    <FileCopyIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Copy link" />
                </MenuItem>
              </Menu>
            </>
          )}
          {onClose && (
            <IconButton
              aria-label="Close details"
              onClick={onClose}
              className={classes.closeButton}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          )}
        </div>
      </div>
      <div className={classes.content}>
        {isMobile ? (
          <div className={classes.mobileContent}>
            {showShareStatus && (
              <div className={classes.mobileStatusRow}>
                <Tooltip title={statusLabel}>
                  {result.isShared ? (
                    <PublicIcon color="primary" fontSize="small" />
                  ) : (
                    <LockIcon color="disabled" fontSize="small" />
                  )}
                </Tooltip>
                <Typography variant="body2" color="textSecondary">
                  {statusLabel}
                </Typography>
              </div>
            )}

            <div className={classes.mobileSection}>
              <Typography variant="subtitle2" className={classes.mobileSectionTitle}>
                Overview
              </Typography>
              <div className={classes.mobileRow}>
                <span className={classes.mobileLabel}>Simulation Date</span>
                <span className={classes.mobileValue}>{dateString}</span>
              </div>
              <div className={classes.mobileRow}>
                <span className={classes.mobileLabel}>Submitted By</span>
                <span className={classes.mobileValue}>
                  {result.accountUsername || '—'}
                </span>
              </div>
              <div className={classes.mobileRow}>
                <span className={classes.mobileLabel}>BOPTEST Version</span>
                <span className={classes.mobileValue}>
                  {result.boptestVersion || '—'}
                </span>
              </div>
            </div>

            <div className={classes.mobileSection}>
              <Typography variant="subtitle2" className={classes.mobileSectionTitle}>
                Key Metrics
              </Typography>
              <div className={classes.mobileMetricGrid}>
                {mobileMetrics.map(metric => (
                  <div className={classes.mobileMetricTile} key={metric.label}>
                    <span className={classes.mobileMetricLabel}>{metric.label}</span>
                    <span className={classes.mobileMetricValue}>{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {mobileScenarioEntries.length > 0 && (
              <div className={classes.mobileSection}>
                <Typography variant="subtitle2" className={classes.mobileSectionTitle}>
                  Scenario
                </Typography>
                {mobileScenarioEntries.map(entry => (
                  <div className={classes.mobileRow} key={entry.label}>
                    <span className={classes.mobileLabel}>{entry.label}</span>
                    <span className={classes.mobileValue}>{entry.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={classes.mobileSection}>
              <Typography variant="subtitle2" className={classes.mobileSectionTitle}>
                Tags
              </Typography>
              {result.tags && result.tags.length > 0 ? (
                <Box className={classes.tagContainer}>
                  {result.tags.map(tag => (
                    <Chip key={tag} label={tag} size="small" color="primary" variant="outlined" />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No tags provided.
                </Typography>
              )}
            </div>
          </div>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <ResultInfoTable result={result} />
            </Grid>
            <Grid item xs={12} md={7}>
              <KPITable result={result} />
            </Grid>
          </Grid>
        )}
      </div>
      <div className={classes.footerBar}>BOPTEST Result</div>
    </div>
  );
};
