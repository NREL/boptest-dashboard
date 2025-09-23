import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Table, TableBody, TableCell, TableRow} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {SignatureDetails, Result} from '../../common/interfaces';
import {KPIBarChart} from './KPIBarChart';

const numberOfResultsToShowChart = 3;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    kpiTable: {
      width: '100%',
    },
    kpiTitleLine: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: theme.spacing(2),
    },
    metricRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
      padding: theme.spacing(1.5, 0),
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    metricHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: theme.spacing(2),
      flexWrap: 'wrap',
    },
    metricName: {
      fontWeight: 500,
    },
    metricValue: {
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
    },
    noComparison: {
      color: theme.palette.text.secondary,
    },
  })
);

interface KPITableProps {
  result: Result;
}

const getSignatureEndpoint = (resultId: string) => {
  return `/api/results/${resultId}/signature`;
};

export const KPITable: React.FC<KPITableProps> = props => {
  const classes = useStyles();
  const [details, setDetails] = useState<SignatureDetails | undefined>(
    undefined
  );

  // propulate the signature details
  useEffect(() => {
    // prevent the use effect from firing on render if we don't have a result
    if (props.result === undefined) return;

    axios.get(getSignatureEndpoint(props.result.uid)).then(response => {
      setDetails(response.data);
    });
  }, [props.result]);

  if (!details) {
    return null;
  }

  const showComparisons = details.numResults >= numberOfResultsToShowChart;

  const formatNumber = (value: number | null | undefined, fractionDigits = 2) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '—';
    }
    return value.toLocaleString(undefined, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
  };

  const metrics = [
    {
      key: 'energy',
      label: 'Total Energy [kWh/m²]',
      value: props.result.energy,
      digits: 2,
      range: details.energyUse,
      show: true,
    },
    {
      key: 'thermalDiscomfort',
      label: 'Thermal Discomfort [Kh/zone]',
      value: props.result.thermalDiscomfort,
      digits: 2,
      range: details.thermalDiscomfort,
      show: true,
    },
    {
      key: 'cost',
      label: 'Total Operations Cost [$ or € /m²]',
      value: props.result.cost,
      digits: 2,
      range: details.cost,
      show: true,
    },
    {
      key: 'emissions',
      label: 'Total CO₂ Emissions [kgCO₂/m²]',
      value: props.result.emissions,
      digits: 2,
      range: details.emissions,
      show: true,
    },
    {
      key: 'aqDiscomfort',
      label: 'Indoor Air Quality Discomfort [ppmh/zone]',
      value: props.result.aqDiscomfort,
      digits: 2,
      range: details.iaq,
      show: true,
    },
    {
      key: 'compTimeRatio',
      label: 'Time Ratio',
      value: props.result.compTimeRatio,
      digits: 2,
      range: details.timeRatio,
      show: true,
    },
    {
      key: 'peakElectricity',
      label: 'Peak Electrical Demand [kW/m²]',
      value: props.result.peakElectricity,
      digits: 2,
      range: details.peakElectricity,
      show: true,
    },
    {
      key: 'peakGas',
      label: 'Peak Gas Demand [kW/m²]',
      value: props.result.peakGas,
      digits: 2,
      range: details.peakGas,
      show: props.result.peakGas !== null && props.result.peakGas !== undefined,
    },
    {
      key: 'peakDistrictHeating',
      label: 'Peak District Heating Demand [kW/m²]',
      value: props.result.peakDistrictHeating,
      digits: 2,
      range: details.peakDistrictHeating,
      show:
        props.result.peakDistrictHeating !== null &&
        props.result.peakDistrictHeating !== undefined,
    },
  ].filter(metric => metric.show);

  if (metrics.length === 0) {
    return null;
  }

  return (
    <div className={classes.kpiTable}>
      <div className={classes.kpiTitleLine}>
        <Typography variant="subtitle1">Key Performance Indicators</Typography>
        <Typography variant="body2" color="textSecondary">
          Comparison sample: {details.numResults}
        </Typography>
      </div>
      {metrics.map(metric => (
        <div key={metric.key} className={classes.metricRow}>
          <div className={classes.metricHeader}>
            <Typography variant="body2" className={classes.metricName}>
              {metric.label}
            </Typography>
            <Typography variant="body1" className={classes.metricValue}>
              {formatNumber(metric.value, metric.digits)}
            </Typography>
          </div>
          {showComparisons ? (
            <KPIBarChart
              value={metric.value}
              min={metric.range?.min}
              max={metric.range?.max}
              digits={metric.digits}
              formatter={formatNumber}
            />
          ) : (
            <Typography variant="caption" className={classes.noComparison}>
              Additional runs are required before we can show a comparison chart.
            </Typography>
          )}
        </div>
      ))}
    </div>
  );
};
