import React from 'react';
import {createStyles, makeStyles, useTheme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() =>
  createStyles({
    chartWrapper: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    },
    track: {
      position: 'relative',
      height: 10,
      borderRadius: 999,
      overflow: 'hidden',
    },
    rangeBand: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      borderRadius: 999,
      opacity: 0.75,
    },
    marker: {
      position: 'absolute',
      top: -3,
      width: 2,
      height: 16,
      borderRadius: 2,
      transform: 'translateX(-50%)',
    },
    labelRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  })
);

interface BarChartProps {
  value: number | null | undefined;
  min: number | null | undefined;
  max: number | null | undefined;
  digits?: number;
  formatter?: (value: number | null | undefined, digits?: number) => string;
}

const clamp = (value: number, min: number, max: number) => {
  if (Number.isNaN(value)) {
    return min;
  }
  if (min > max) {
    return value;
  }
  return Math.min(Math.max(value, min), max);
};

export const KPIBarChart: React.FC<BarChartProps> = props => {
  const classes = useStyles();
  const theme = useTheme();
  const format = props.formatter ?? ((val: number | null | undefined, digits = 2) => {
    if (val === null || val === undefined || Number.isNaN(val)) {
      return '—';
    }
    return val.toLocaleString(undefined, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  });

  const numbers: number[] = [];
  if (Number.isFinite(props.value)) {
    numbers.push(props.value as number);
  }
  if (Number.isFinite(props.min as number)) {
    numbers.push(props.min as number);
  }
  if (Number.isFinite(props.max as number)) {
    numbers.push(props.max as number);
  }

  if (numbers.length === 0) {
    numbers.push(0, 1);
  }

  const baseMin = Math.min(...numbers);
  const baseMax = Math.max(...numbers);
  const span = baseMax - baseMin;
  const paddingBase = span === 0 ? Math.max(Math.abs(baseMax), 1) * 0.15 : span * 0.2;
  const padding = paddingBase === 0 ? 1 : paddingBase;
  let adjustedMin = baseMin - padding;
  let adjustedMax = baseMax + padding;

  if (adjustedMin === adjustedMax) {
    adjustedMax = adjustedMin + 1;
  }

  const effectiveSpan = adjustedMax - adjustedMin;
  const minPercent = Number.isFinite(props.min as number)
    ? ((props.min as number) - adjustedMin) / effectiveSpan
    : null;
  const maxPercent = Number.isFinite(props.max as number)
    ? ((props.max as number) - adjustedMin) / effectiveSpan
    : null;

  const rangeStart = minPercent !== null ? clamp(minPercent * 100, 0, 100) : 0;
  let rangeWidth = 100 - rangeStart;
  if (minPercent !== null && maxPercent !== null) {
    const rawWidth = Math.max(maxPercent - minPercent, 0) * 100;
    const minWidth = 6;
    rangeWidth = Math.max(rawWidth, minWidth);
    rangeWidth = Math.min(rangeWidth, 100 - rangeStart);
  }

  const markerPercent = Number.isFinite(props.value as number)
    ? clamp(((props.value as number) - adjustedMin) / effectiveSpan, 0, 1) * 100
    : null;

  const showMarker = markerPercent !== null && Number.isFinite(markerPercent);

  const formattedRangeMin = format(props.min, props.digits);
  const formattedRangeMax = format(props.max, props.digits);

  return (
    <div className={classes.chartWrapper}>
      <div
        className={classes.track}
        style={{
          backgroundColor: theme.palette.action.hover,
        }}
      >
        {minPercent !== null && maxPercent !== null && (
          <div
            className={classes.rangeBand}
            style={{
              left: `${rangeStart}%`,
              width: `${rangeWidth}%`,
              backgroundColor: theme.palette.primary.light,
              opacity: 0.25,
            }}
          />
        )}
        {showMarker && (
          <div
            className={classes.marker}
            style={{
              left: `${markerPercent}%`,
              backgroundColor: theme.palette.primary.main,
            }}
          />
        )}
      </div>
      <div className={classes.labelRow}>
        <Typography variant="caption" color="textSecondary">
          {formattedRangeMin}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {formattedRangeMax}
        </Typography>
      </div>
    </div>
  );
};
