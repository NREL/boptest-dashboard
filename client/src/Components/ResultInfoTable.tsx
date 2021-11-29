import React, {useEffect} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {Result} from '../../common/interfaces';

const useStyles = makeStyles(() =>
  createStyles({
    tableContainer: {
      padding: '0 0 16px 0',
    },
    idTable: {
      width: '35%',
    },
    sectionHeader: {
      padding: '16px 0 0 0',
    },
    grayed: {
      backgroundColor: 'rgb(236, 239, 240)',
    },
    longboi: {
      width: '100%',
    },
  })
);

const camelCaseToTitleCaseWithSpaces = (camelCase: string): string => {
  return camelCase
    .replace(/([A-Z])/g, match => ` ${match}`)
    .replace(/^./, match => match.toUpperCase());
};

interface ResultInfoTableProps {
  result: Result;
}

export const ResultInfoTable: React.FC<ResultInfoTableProps> = props => {
  const classes = useStyles();

  useEffect(() => {
    // prevent the use effect from firing on render if we don't have a result
    if (props.result === undefined) return;
  }, [props.result]);

  const dateString = new Date(props.result.dateRun).toLocaleString();

  const renderScenario = () => {
    const scenarioArray = [];
    let isGrey = true;
    for (const scenarioKey in props.result.scenario) {
      scenarioArray.push(
        <TableRow className={isGrey ? classes.grayed : ''} key={scenarioKey}>
          <TableCell>
            <Typography variant="body2">
              {camelCaseToTitleCaseWithSpaces(scenarioKey)}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body1">
              {props.result.scenario[scenarioKey]}
            </Typography>
          </TableCell>
        </TableRow>
      );
      isGrey = !isGrey;
    }
    return scenarioArray;
  };

  const renderTags = () => {
    const tagArray = [];
    let isGrey = true;
    if (props.result.tags.length <= 0) {
      return (
        <TableRow className={classes.grayed}>
          <TableCell colSpan={2}>
            <Typography variant="body2">
              This result does not have any tags associated with it.
            </Typography>
          </TableCell>
        </TableRow>
      );
    }
    props.result.tags.forEach((tag, idx) => {
      if (idx % 2 === 0) {
        tagArray.push(
          <TableRow className={isGrey ? classes.grayed : ''} key={idx}>
            <TableCell>
              <Typography variant="body1">{tag}</Typography>
            </TableCell>
            {idx + 1 < props.result.tags.length ? (
              <TableCell>
                <Typography variant="body1">
                  {props.result.tags[idx + 1]}
                </Typography>
              </TableCell>
            ) : (
              <TableCell />
            )}
          </TableRow>
        );
        isGrey = !isGrey;
      }
    });
    return tagArray;
  };

  return (
    <div className={classes.idTable}>
      <TableContainer className={classes.tableContainer}>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography
                  variant="subtitle2"
                  className={classes.sectionHeader}
                >
                  BUILDING TYPE
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow className={classes.grayed}>
              <TableCell className={classes.longboi} colSpan={2}>
                <Typography variant="body2">
                  {props.result.buildingTypeName}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography
                  variant="subtitle2"
                  className={classes.sectionHeader}
                >
                  PARAMETERS
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow className={classes.grayed}>
              <TableCell>
                <Typography variant="body2">Time Period</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">
                  {props.result.timePeriod}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body2">
                  Electricity Price Scenario
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">
                  {props.result.electricityPrice}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow className={classes.grayed}>
              <TableCell>
                <Typography variant="body2">
                  Weather Forcast Uncertainty
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">
                  {props.result.weatherForecastUncertainty}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body2">Forcast Horizon</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">
                  {props.result.forecastParameters.horizon}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow className={classes.grayed}>
              <TableCell>
                <Typography variant="body2">Forcast Interval</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">
                  {props.result.forecastParameters.interval}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography
                  variant="subtitle2"
                  className={classes.sectionHeader}
                >
                  GENERAL
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow className={classes.grayed}>
              <TableCell>
                <Typography variant="body2">Identifier</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">{props.result.uid}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body2">Simulation Date</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">{dateString}</Typography>
              </TableCell>
            </TableRow>
            <TableRow className={classes.grayed}>
              <TableCell>
                <Typography variant="body2">BOPTest Version</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">
                  {props.result.boptestVersion}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body2">Control Step</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">
                  {props.result.controlStep}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow className={classes.grayed}>
              <TableCell>
                <Typography variant="body2">Contact</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">
                  {props.result.accountEmail}
                </Typography>
              </TableCell>
            </TableRow>
            {props.result.scenario && (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography
                    variant="subtitle2"
                    className={classes.sectionHeader}
                  >
                    SCENARIO
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {renderScenario()}
            {props.result.tags.length > 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography
                    variant="subtitle2"
                    className={classes.sectionHeader}
                  >
                    TAGS
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {renderTags()}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
