import React from 'react';
import {createStyles, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import {ResponsiveScatterPlot} from '@nivo/scatterplot';

import {Data} from '../Lib/TableHelpers';

export type NumericColumnKey =
  | 'totalEnergy'
  | 'thermalDiscomfort'
  | 'aqDiscomfort'
  | 'cost'
  | 'peakElectricity'
  | 'peakGas'
  | 'peakDistrictHeating'
  | 'compTimeRatio';

interface AxisConfig {
  id: NumericColumnKey;
  label: string;
}

interface ResultsScatterPlotProps {
  rows: Data[];
  xAxis: AxisConfig;
  yAxis: AxisConfig;
  onPointClick: (row: Data) => void;
  isLoading?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
    },
    plotWrapper: {
      flex: 1,
      minHeight: 360,
      position: 'relative',
    },
    placeholder: {
      height: '100%',
      minHeight: 360,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing(2),
      padding: theme.spacing(4),
      textAlign: 'center',
    },
    tooltip: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[3],
      padding: theme.spacing(1.5),
      border: `1px solid ${theme.palette.divider}`,
    },
    tooltipTitle: {
      fontWeight: 600,
      marginBottom: theme.spacing(0.5),
    },
    tooltipRow: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: theme.spacing(2),
      fontSize: '0.875rem',
      lineHeight: 1.4,
    },
  })
);

interface ScatterPoint {
  x: number;
  y: number;
  row: Data;
}

const valueFormatters: Partial<Record<NumericColumnKey, (value: number) => string>> = {
  cost: value => value.toFixed(2),
};

const defaultFormatter = (value: number) => value.toFixed(4);

export const ResultsScatterPlot: React.FC<ResultsScatterPlotProps> = props => {
  const {
    rows,
    xAxis,
    yAxis,
    onPointClick,
    isLoading = false,
  } = props;
  const classes = useStyles();
  const theme = useTheme();

  const validPoints = React.useMemo(() => {
    const data: ScatterPoint[] = [];
    rows.forEach(row => {
      const xValue = row[xAxis.id];
      const yValue = row[yAxis.id];
      if (typeof xValue !== 'number' || typeof yValue !== 'number') {
        return;
      }
      if (!Number.isFinite(xValue) || !Number.isFinite(yValue)) {
        return;
      }
      data.push({x: xValue, y: yValue, row});
    });
    return data;
  }, [rows, xAxis.id, yAxis.id]);

  const scatterData = React.useMemo(
    () => [
      {
        id: 'Results',
        data: validPoints.map(point => ({
          x: point.x,
          y: point.y,
          row: point.row,
        })),
      },
    ],
    [validPoints]
  );

  const xFormatter = valueFormatters[xAxis.id] ?? defaultFormatter;
  const yFormatter = valueFormatters[yAxis.id] ?? defaultFormatter;

  const tooltip = React.useCallback(
    ({node}: {node: any}) => {
      const point: ScatterPoint | undefined = node?.data
        ? {
            x: node.data.x,
            y: node.data.y,
            row: node.data.row as Data,
          }
        : undefined;
      if (!point) {
        return null;
      }

      const runDate = point.row.dateRun
        ? new Date(point.row.dateRun).toLocaleString()
        : 'Unknown';

      return (
        <div className={classes.tooltip}>
          <Typography variant="body2" className={classes.tooltipTitle}>
            {point.row.buildingTypeName}
          </Typography>
          <div className={classes.tooltipRow}>
            <span>{xAxis.label}</span>
            <strong>{xFormatter(point.x)}</strong>
          </div>
          <div className={classes.tooltipRow}>
            <span>{yAxis.label}</span>
            <strong>{yFormatter(point.y)}</strong>
          </div>
          <div className={classes.tooltipRow}>
            <span>Date Run</span>
            <span>{runDate}</span>
          </div>
        </div>
      );
    },
    [classes.tooltip, classes.tooltipRow, classes.tooltipTitle, xAxis.label, xFormatter, yAxis.label, yFormatter]
  );

  const handlePointClick = React.useCallback(
    (point: any) => {
      if (!point?.data?.row) {
        return;
      }
      onPointClick(point.data.row as Data);
    },
    [onPointClick]
  );

  const renderPlaceholder = () => {
    if (isLoading && validPoints.length === 0) {
      return (
        <div className={classes.placeholder}>
          <CircularProgress color="primary" />
          <Typography variant="body1">Loading results...</Typography>
        </div>
      );
    }

    if (!isLoading && rows.length > 0 && validPoints.length === 0) {
      return (
        <div className={classes.placeholder}>
          <Typography variant="body1">
            No results can be plotted with the selected axes.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Try choosing a different combination of metrics to visualize.
          </Typography>
        </div>
      );
    }

    if (!isLoading && rows.length === 0) {
      return (
        <div className={classes.placeholder}>
          <Typography variant="body1">No results available.</Typography>
        </div>
      );
    }

    return null;
  };

  const placeholder = renderPlaceholder();

  const nivoTheme = React.useMemo(
    () => ({
      textColor: theme.palette.text.primary,
      fontSize: 13,
      grid: {
        line: {
          stroke: theme.palette.divider,
          strokeWidth: 1,
          strokeDasharray: '4 4',
        },
      },
      tooltip: {
        container: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
      },
      axis: {
        ticks: {
          text: {
            fontSize: 13,
            fontWeight: 500,
            fill: theme.palette.text.secondary,
          },
        },
        legend: {
          text: {
            fontSize: 14,
            fontWeight: 600,
            fill: theme.palette.text.primary,
          },
        },
      },
    }),
    [theme.palette.divider, theme.palette.text.primary, theme.palette.text.secondary]
  );

  return (
    <div className={classes.root}>
      <Paper elevation={0} className={classes.plotWrapper}>
        {placeholder ? (
          placeholder
        ) : (
          <ResponsiveScatterPlot
            data={scatterData}
            margin={{top: 24, right: 40, bottom: 72, left: 80}}
            xScale={{type: 'linear', min: 'auto', max: 'auto'}}
            xFormat={value => xFormatter(Number(value))}
            yScale={{type: 'linear', min: 'auto', max: 'auto'}}
            yFormat={value => yFormatter(Number(value))}
            axisBottom={{
              legend: xAxis.label,
              legendOffset: 58,
              legendPosition: 'middle',
              tickSize: 5,
              tickPadding: 7,
            }}
            axisLeft={{
              legend: yAxis.label,
              legendOffset: -70,
              legendPosition: 'middle',
              tickSize: 5,
              tickPadding: 5,
            }}
            colors={[theme.palette.primary.main]}
            blendMode="multiply"
            useMesh
            tooltip={tooltip}
            onClick={handlePointClick}
            theme={nivoTheme as any}
          />
        )}
      </Paper>
    </div>
  );
};

ResultsScatterPlot.displayName = 'ResultsScatterPlot';
