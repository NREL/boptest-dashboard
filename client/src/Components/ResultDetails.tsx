import React from 'react';
import axios from 'axios';
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
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import ShareIcon from '@material-ui/icons/Share';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import PublicIcon from '@material-ui/icons/Public';
import LockIcon from '@material-ui/icons/Lock';

import BoptestLogo from '../static/assets/boptest-logo.svg';

import {KPITable} from './KPITable';
import {ResultInfoTable} from './ResultInfoTable';
import {Data} from '../Lib/TableHelpers';
import {useUser} from '../Context/user-context';

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
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      '&:hover': {
        borderColor: theme.palette.primary.dark,
        backgroundColor: 'rgba(0, 136, 169, 0.08)',
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
    sectionHeaderRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(1),
    },
    sectionActions: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
    sectionTitle: {
      fontWeight: 600,
      textTransform: 'uppercase',
      fontSize: '0.75rem',
      letterSpacing: 0.6,
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(1),
    },
    visibilityToggleWrapper: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 32,
    },
    shareButtonWrapper: {
      display: 'flex',
      alignItems: 'center',
    },
    visibilityToggleButton: {
      padding: theme.spacing(0.5),
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
  showMobileHeader?: boolean;
  onShareStatusChange?: (isShared: boolean) => void;
}

export const ResultDetails: React.FC<ResultDetailsProps> = props => {
  const {
    result,
    showShareStatus = true,
    onClose,
    showMobileHeader = true,
    onShareStatusChange,
  } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {csrfToken} = useUser();

  const [isShared, setIsShared] = React.useState(result.isShared === true);
  const [isShareUpdating, setIsShareUpdating] = React.useState(false);

  const canShare = isShared;
  const [shareAnchor, setShareAnchor] = React.useState<null | HTMLElement>(null);
  const canUseWebShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const statusLabel = isShared ? 'Shared publicly' : 'Private result';

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

  React.useEffect(() => {
    const nextShared = result.isShared === true;
    setIsShared(nextShared);
    if (!nextShared) {
      closeShareMenu();
    }
  }, [result.isShared]);

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

  const handleToggleShareStatus = async () => {
    if (isShareUpdating) {
      return;
    }

    const nextShared = !isShared;
    setIsShareUpdating(true);
    try {
      const headers: Record<string, string> = {};
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }

      await axios.patch(
        '/api/results/share',
        {id: result.id, share: nextShared},
        {
          withCredentials: true,
          headers,
        }
      );

      setIsShared(nextShared);
      if (!nextShared) {
        closeShareMenu();
      }
      onShareStatusChange?.(nextShared);
    } catch (error) {
      console.error('Unable to update sharing preference', error);
    } finally {
      setIsShareUpdating(false);
    }
  };

  const mobileMetrics = [
    {
      label: 'Total Energy [kWh/m²]',
      value: formatWithUnit(result.energy ?? result.totalEnergy, 'kWh/m²'),
    },
    {
      label: 'Thermal Discomfort [Kh/zone]',
      value: formatWithUnit(result.thermalDiscomfort, 'Kh/zone'),
    },
    {
      label: 'Indoor Air Quality Discomfort [ppmh/zone]',
      value: formatWithUnit(result.aqDiscomfort, 'ppmh/zone'),
    },
    {
      label: 'Total Operations Cost [$ or € /m²]',
      value: formatNumberValue(result.cost),
    },
    {
      label: 'Total CO₂ Emissions [kgCO₂/m²]',
      value: formatWithUnit(result.emissions, 'kgCO₂/m²'),
    },
    {
      label: 'Time Ratio',
      value: formatNumberValue(result.compTimeRatio ?? result.timeRatio),
    },
    {
      label: 'Peak Electrical Demand [kW/m²]',
      value: formatWithUnit(result.peakElectricity, 'kW/m²'),
    },
    {
      label: 'Peak Gas Demand [kW/m²]',
      value: formatWithUnit(result.peakGas, 'kW/m²'),
    },
    {
      label: 'Peak District Heating Demand [kW/m²]',
      value: formatWithUnit(result.peakDistrictHeating, 'kW/m²'),
    },
  ];

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
    const headerSummary = (
      <>
        <Typography variant="h6" className={classes.mobileTitle}>
          {`Test Case: ${result.buildingTypeName}`}
        </Typography>
        <Typography variant="body2" className={classes.mobileSubtitle}>
          Result ID: {result.uid}
        </Typography>
      </>
    );
    const visibilityToggleLabel = isShared
      ? 'Make result private'
      : 'Share result publicly';
    const visibilityControl = showShareStatus ? (
      <div className={classes.visibilityToggleWrapper}>
        {isShareUpdating ? (
          <CircularProgress size={18} thickness={5} />
        ) : (
          <Tooltip title={statusLabel}>
            <span>
              <IconButton
                size="small"
                className={classes.visibilityToggleButton}
                aria-label={visibilityToggleLabel}
                aria-pressed={isShared}
                onClick={handleToggleShareStatus}
              >
                {isShared ? (
                  <PublicIcon color="primary" fontSize="small" />
                ) : (
                  <LockIcon color="disabled" fontSize="small" />
                )}
              </IconButton>
            </span>
          </Tooltip>
        )}
      </div>
    ) : null;
    const shareAction = canShare ? (
      <div className={classes.shareButtonWrapper}>
        <Button
          size="small"
          variant="outlined"
          onClick={openShareMenu}
          className={classes.shareButton}
        >
          Share
        </Button>
        {shareMenu}
      </div>
    ) : null;
    const sectionActions = shareAction || visibilityControl ? (
      <div className={classes.sectionActions}>
        {shareAction}
        {visibilityControl}
      </div>
    ) : null;

    return (
      <div className={classes.root}>
        {showMobileHeader ? (
          <div className={classes.header}>
            <div className={classes.headerTop}>
              <img src={BoptestLogo} alt="BOPTEST" className={classes.logo} />
              <div className={classes.controls}>
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
            <div className={classes.headerBody}>{headerSummary}</div>
          </div>
        ) : null}

        <div className={classes.content}>
          <div className={classes.section}>
            <div className={classes.sectionHeaderRow}>
              <Typography
                variant="subtitle2"
                className={classes.sectionTitle}
                style={{marginBottom: 0}}
              >
                Overview
              </Typography>
              {sectionActions}
            </div>
            <div className={classes.overviewRow}>
              <span className={classes.overviewLabel}>Result ID</span>
              <span className={classes.overviewValue}>{result.uid}</span>
            </div>
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
