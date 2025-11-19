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
import {Data} from '../Lib/TableHelpers';
import {buildScenarioEntries} from '../Lib/scenarioDisplay';

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
  result: Data;
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

  const scenarioEntries = buildScenarioEntries(props.result.scenario).map(
    entry => ({label: entry.label, value: entry.value})
  );

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
      rows: scenarioEntries,
    },
  ];

  if (scenarioEntries.length === 0) {
    sections.splice(1, 1);
  }

  const hasTags = props.result.tags && props.result.tags.length > 0;

  return (
    <TableContainer className={classes.tableContainer}>
      <Table size="small">
        <TableBody>
          {sections.map((section, index) => (
            <React.Fragment key={section.title}>
              {section.rows.length > 0 && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className={classes.labelCell}
                    style={index === 0 ? {paddingTop: 0} : undefined}
                  >
                    <Typography
                      variant="subtitle2"
                      className={classes.sectionHeader}
                      style={index === 0 ? {paddingTop: 0} : undefined}
                    >
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
