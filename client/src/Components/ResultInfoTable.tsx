import React from 'react';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {Result} from '../../common/interfaces';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableContainer: {
      paddingBottom: theme.spacing(1),
    },
    sectionHeader: {
      padding: theme.spacing(2, 0, 1),
      fontWeight: 600,
      color: theme.palette.text.secondary,
    },
    row: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    labelCell: {
      width: '45%',
      borderBottom: 'none',
      padding: theme.spacing(1, 2, 1, 0),
    },
    valueCell: {
      borderBottom: 'none',
      padding: theme.spacing(1, 0, 1, 0),
    },
    tagRow: {
      borderBottom: 'none',
      padding: theme.spacing(1, 0, 0, 0),
    },
    tagContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing(1),
    },
    emptyState: {
      color: theme.palette.text.secondary,
    },
  })
);

interface ResultInfoTableProps {
  result: Result;
}

export const ResultInfoTable: React.FC<ResultInfoTableProps> = props => {
  const classes = useStyles();
  const dateString = new Date(props.result.dateRun).toLocaleString();
  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined || value === '') {
      return '—';
    }
    if (Array.isArray(value)) {
      return value.map(item => formatValue(item)).join(', ');
    }
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    return String(value);
  };

  const toTitleCase = (key: string): string => {
    const normalized = key
      .replace(/[_-]/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/\s+/g, ' ')
      .trim();

    if (!normalized) {
      return key;
    }

    return normalized.replace(/\b\w/g, match => match.toUpperCase());
  };

  const scenarioLabels: Record<string, string> = {
    timePeriod: 'Time Period',
    electricityPrice: 'Electricity Price Scenario',
    weatherForecastUncertainty: 'Weather Forecast Uncertainty',
  };

  const scenarioRows = Object.entries({
    timePeriod: props.result.timePeriod,
    electricityPrice: props.result.electricityPrice,
    weatherForecastUncertainty: props.result.weatherForecastUncertainty,
    ...props.result.scenario,
  })
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      const label = scenarioLabels[key] || toTitleCase(key);
      return {label, value: formatValue(value)};
    })
    .reduce((acc: Array<{label: string; value: string}>, current) => {
      if (!acc.find(item => item.label === current.label && item.value === current.value)) {
        acc.push(current);
      }
      return acc;
    }, []);

  const forecastParameters = props.result.forecastParameters || {};
  const forecastRows = Object.entries(forecastParameters)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => ({
      label: toTitleCase(key),
      value: formatValue(value),
    }));

  const sections: Array<{
    title: string;
    rows: Array<{label: string; value: string}>;
  }> = [
    {
      title: 'Overview',
      rows: [
        {label: 'Simulation Date', value: dateString},
        {label: 'Submitted By', value: formatValue(props.result.accountUsername)},
        {label: 'BOPTEST Version', value: formatValue(props.result.boptestVersion)},
        {label: 'Control Step', value: formatValue(props.result.controlStep)},
      ],
    },
    {
      title: 'Scenario',
      rows: [
        ...scenarioRows,
      ],
    },
  ];

  if (forecastRows.length > 0) {
    sections.push({title: 'Forecast Settings', rows: forecastRows});
  }

  const hasTags = props.result.tags && props.result.tags.length > 0;

  return (
    <TableContainer className={classes.tableContainer}>
      <Table size="small">
        <TableBody>
          {sections.map(section => (
            <React.Fragment key={section.title}>
              {section.rows.length > 0 && (
                <TableRow>
                  <TableCell colSpan={2} className={classes.labelCell}>
                    <Typography variant="subtitle2" className={classes.sectionHeader}>
                      {section.title.toUpperCase()}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {section.rows.map(row => (
                <TableRow className={classes.row} key={`${section.title}-${row.label}`}>
                  <TableCell className={classes.labelCell}>
                    <Typography variant="body2" color="textSecondary">
                      {row.label}
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.valueCell}>
                    <Typography variant="body1">{row.value}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
          <TableRow>
            <TableCell colSpan={2} className={classes.labelCell}>
              <Typography variant="subtitle2" className={classes.sectionHeader}>
                TAGS
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} className={classes.tagRow}>
              {hasTags ? (
                <Box className={classes.tagContainer}>
                  {props.result.tags.map(tag => (
                    <Chip key={tag} size="small" label={tag} color="primary" variant="outlined" />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" className={classes.emptyState}>
                  This result does not have any tags associated with it.
                </Typography>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
