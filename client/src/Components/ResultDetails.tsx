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
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme} from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ShareIcon from '@material-ui/icons/Share';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import PublicIcon from '@material-ui/icons/Public';
import LockIcon from '@material-ui/icons/Lock';

import BoptestLogo from '../static/assets/boptest-logo.svg';

import {KPITable} from './KPITable';
import {ResultInfoTable} from './ResultInfoTable';
import {Data} from '../Lib/TableHelpers';

const useDesktopStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxSizing: 'border-box',
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing(1.5),
      marginBottom: 16,
      padding: theme.spacing(1.5, 1.5, 1.25),
      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      backgroundColor: theme.palette.background.paper,
      position: 'sticky',
      top: 0,
      zIndex: 1,
    },
    headerText: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      minWidth: 0,
      flex: 1,
    },
    subheading: {
      color: theme.palette.text.secondary,
    },
    headerActions: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
    content: {
      flexGrow: 1,
      overflowY: 'auto',
      padding: theme.spacing(2, 2, 3),
      minHeight: 0,
      boxSizing: 'border-box',
    },
  })
);

const useMobileStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxSizing: 'border-box',
      backgroundColor: theme.palette.background.default,
    },
    header: {
      padding: theme.spacing(1.5, 2.25, 1.5),
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
      boxShadow: '0 8px 24px rgba(13, 108, 133, 0.2)',
    },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing(1.5),
    },
    logo: {
      height: 38,
      width: 'auto',
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
    shareButton: {
      color: theme.palette.primary.contrastText,
      borderColor: 'rgba(255, 255, 255, 0.45)',
      '&:hover': {
        borderColor: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
      },
    },
    headerBody: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      paddingTop: theme.spacing(1),
    },
    mobileTitle: {
      color: theme.palette.primary.contrastText,
    },
    mobileSubtitle: {
      color: 'rgba(255, 255, 255, 0.75)',
    },
    statusRow: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      marginTop: theme.spacing(1),
      color: 'rgba(255, 255, 255, 0.85)',
    },
    content: {
      flexGrow: 1,
      overflowY: 'auto',
      padding: theme.spacing(1.5, 1.25, 2.25),
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1.75),
      backgroundColor: theme.palette.background.default,
    },
    section: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.spacing(1.5),
      padding: theme.spacing(1.4, 1.4, 1.7),
      boxShadow: '0 6px 18px rgba(15, 30, 84, 0.08)',
    },
    sectionTitle: {
      fontWeight: 600,
      textTransform: 'uppercase',
      fontSize: '0.75rem',
      letterSpacing: 0.6,
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(1),
    },
    overviewRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      marginBottom: theme.spacing(1),
    },
    overviewLabel: {
      fontSize: '0.75rem',
      color: 'rgba(0, 0, 0, 0.54)',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    overviewValue: {
      fontWeight: 500,
      color: theme.palette.text.primary,
    },
    metricGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing(1),
    },
    metricTile: {
      flex: '1 1 calc(50% - 12px)',
      minWidth: 130,
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      borderRadius: theme.spacing(1.25),
      padding: theme.spacing(1, 1.25),
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
    metricLabel: {
      fontSize: '0.75rem',
      color: 'rgba(0, 0, 0, 0.6)',
      textTransform: 'uppercase',
      letterSpacing: 0.35,
    },
    metricValue: {
      fontWeight: 600,
      color: theme.palette.text.primary,
    },
    scenarioList: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
    },
    tagContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing(1),
    },
  })
);

interface ResultDetailsProps {
  result: Data;
  showShareStatus?: boolean;
  onClose?: () => void;
}

export const ResultDetails: React.FC<ResultDetailsProps> = props => {
  const {result, showShareStatus = true, onClose} = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const canShare = result.isShared === true;
  const [shareAnchor, setShareAnchor] = React.useState<null | HTMLElement>(null);
  const canUseWebShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const statusLabel = result.isShared ? 'Shared publicly' : 'Private result';

  const formatNumberValue = (value: number | null | undefined, digits = 2) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '—';
    }
    return value.toFixed(digits);
  };

  const formatWithUnit = (
    value: number | null | undefined,
    unit: string,
    digits = 2
  ) => {
    const formatted = formatNumberValue(value, digits);
    return formatted === '—' ? formatted : `${formatted} ${unit}`;
  };

  const copyLinkToClipboard = () => {
    const {origin} = window.location;
    const shareUrl = `${origin}/result/${result.uid}`;
    navigator.clipboard.writeText(shareUrl).catch(() => {
      // ignore clipboard failures
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

    try {
      await navigator.share({
        title: 'BOPTEST Result',
        text: `Check out this BOPTEST result for ${result.buildingTypeName}`,
        url: getShareUrl(),
      });
    } catch (error) {
      // ignore share cancellation/errors
    }
  };

  const handleCopyShareLink = () => {
    closeShareMenu();
    copyLinkToClipboard();
  };

  const mobileMetrics = [
    {
      label: 'Total Energy',
      value: formatWithUnit(result.totalEnergy, 'kWh/m²'),
    },
    {
      label: 'Thermal Discomfort',
      value: formatWithUnit(result.thermalDiscomfort, 'Kh/zone'),
    },
    {
      label: 'IAQ Discomfort',
      value: formatWithUnit(result.aqDiscomfort, 'ppmh/zone'),
    },
    {
      label: 'Operations Cost',
      value: formatNumberValue(result.cost),
    },
    {
      label: 'CO₂ Emissions',
      value: formatWithUnit(result.emissions, 'kgCO₂/m²'),
    },
    {
      label: 'Comp Time Ratio',
      value: formatNumberValue(result.compTimeRatio),
    },
    {
      label: 'Peak Electricity',
      value: formatWithUnit(result.peakElectricity, 'kW/m²'),
    },
    result.peakGas !== null && result.peakGas !== undefined
      ? {
          label: 'Peak Gas',
          value: formatWithUnit(result.peakGas, 'kW/m²'),
        }
      : null,
    result.peakDistrictHeating !== null &&
    result.peakDistrictHeating !== undefined
      ? {
          label: 'Peak District Heat',
          value: formatWithUnit(result.peakDistrictHeating, 'kW/m²'),
        }
      : null,
  ].filter((metric): metric is {label: string; value: string} => Boolean(metric));

  const mobileScenarioEntries = [
    {label: 'Time Period', value: result.timePeriod},
    {label: 'Electricity Price', value: result.electricityPrice},
    {
      label: 'Forecast Uncertainty',
      value: result.weatherForecastUncertainty,
    },
  ].filter(entry => entry.value);

  const shareMenu = canShare ? (
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
  ) : null;

  const dateString = new Date(result.dateRun).toLocaleString();

  if (isMobile) {
    const classes = useMobileStyles();
    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <div className={classes.headerTop}>
            <img src={BoptestLogo} alt="BOPTEST" className={classes.logo} />
            <div className={classes.controls}>
              {canShare && (
                <>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={openShareMenu}
                    className={classes.shareButton}
                  >
                    Share
                  </Button>
                  {shareMenu}
                </>
              )}
              {onClose && (
                <IconButton
                  aria-label="Close details"
                  onClick={onClose}
                  size="small"
                  style={{color: 'inherit'}}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </div>
          </div>
          <div className={classes.headerBody}>
            <Typography variant="h6" className={classes.mobileTitle}>
              {`Test Case: ${result.buildingTypeName}`}
            </Typography>
            <Typography variant="body2" className={classes.mobileSubtitle}>
              Result ID: {result.uid}
            </Typography>
          </div>
          {showShareStatus && (
            <div className={classes.statusRow}>
              <Tooltip title={statusLabel}>
                {result.isShared ? (
                  <PublicIcon fontSize="small" />
                ) : (
                  <LockIcon fontSize="small" />
                )}
              </Tooltip>
              <Typography variant="body2" className={classes.statusText}>
                {statusLabel}
              </Typography>
            </div>
          )}
        </div>

        <div className={classes.content}>
          <div className={classes.section}>
            <Typography variant="subtitle2" className={classes.sectionTitle}>
              Overview
            </Typography>
            <div className={classes.overviewRow}>
              <span className={classes.overviewLabel}>Simulation Date</span>
              <span className={classes.overviewValue}>{dateString}</span>
            </div>
            <div className={classes.overviewRow}>
              <span className={classes.overviewLabel}>Submitted By</span>
              <span className={classes.overviewValue}>
                {result.accountUsername || '—'}
              </span>
            </div>
            <div className={classes.overviewRow}>
              <span className={classes.overviewLabel}>BOPTEST Version</span>
              <span className={classes.overviewValue}>
                {result.boptestVersion || '—'}
              </span>
            </div>
          </div>

          <div className={classes.section}>
            <Typography variant="subtitle2" className={classes.sectionTitle}>
              Key Metrics
            </Typography>
            <div className={classes.metricGrid}>
              {mobileMetrics.map(metric => (
                <div className={classes.metricTile} key={metric.label}>
                  <span className={classes.metricLabel}>{metric.label}</span>
                  <span className={classes.metricValue}>{metric.value}</span>
                </div>
              ))}
            </div>
          </div>

          {mobileScenarioEntries.length > 0 && (
            <div className={classes.section}>
              <Typography variant="subtitle2" className={classes.sectionTitle}>
                Scenario
              </Typography>
              <div className={classes.scenarioList}>
                {mobileScenarioEntries.map(entry => (
                  <div className={classes.overviewRow} key={entry.label}>
                    <span className={classes.overviewLabel}>{entry.label}</span>
                    <span className={classes.overviewValue}>{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={classes.section}>
            <Typography variant="subtitle2" className={classes.sectionTitle}>
              Tags
            </Typography>
            {result.tags && result.tags.length > 0 ? (
              <Box className={classes.tagContainer}>
                {result.tags.map(tag => (
                  <Chip
                    key={tag}
                    size="small"
                    label={tag}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No tags provided.
              </Typography>
            )}
          </div>
        </div>
      </div>
    );
  }

  const classes = useDesktopStyles();
  return (
    <div className={classes.root}>
      <div className={classes.headerRow}>
        <div className={classes.headerText}>
          <Typography variant="h6" noWrap>
            {`TEST CASE: ${result.buildingTypeName}`}
          </Typography>
          <Typography variant="body2" className={classes.subheading} noWrap>
            Result ID: {result.uid}
          </Typography>
        </div>
        {canShare && (
          <div className={classes.headerActions}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<ShareIcon />}
              onClick={openShareMenu}
            >
              Share
            </Button>
            {shareMenu}
          </div>
        )}
      </div>

      <div className={classes.content}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <ResultInfoTable result={result} />
          </Grid>
          <Grid item xs={12} md={7}>
            <KPITable result={result} />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
