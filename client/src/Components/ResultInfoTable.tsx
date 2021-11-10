import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {SignatureDetails} from '../../../common/interfaces';

const useStyles = makeStyles((theme: Theme) =>
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

// const getFlattenedObj = obj => {
//   const flattenedPairs = [];
//   const traverse = obj => {
//     for (const [key, value] of Object.entries(obj)) {
//       if (typeof value === 'string' || typeof value === 'number') {
//         flattenedPairs.push([key, value]);
//       } else if (typeof value === 'object') {
//         traverse(value);
//       }
//     }
//   };
//   traverse(obj);
//   return flattenedPairs;
// };

interface ResultInfoTableProps {
  result: any;
}

const getSignatureEndpoint = (resultId: string) => {
  return `/api/results/${resultId}/signature`;
};

export const ResultInfoTable: React.FC<ResultInfoTableProps> = props => {
  const classes = useStyles();
  const [details, setDetails] = useState<SignatureDetails | undefined>(
    undefined
  );
  // const [flattenedProperties, setFlattenedProperties] = useState([]);

  // propulate the signature details
  useEffect(() => {
    // prevent the use effect from firing on render if we don't have a result
    if (props.result === undefined) return;

    // get the signature details for the result
    axios.get(getSignatureEndpoint(props.result.uid)).then(response => {
      setDetails(response.data);
    });

    // get the entire object of controller properties ready to go
    // and split into a flattened structure we can map over
    // setFlattenedProperties(getFlattenedObj(props.result.controllerProperties));
  }, [props.result]);

  var dateString = new Date(props.result.dateRun).toLocaleString();

  const renderTags = () => {
    let tagArray = [];
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
            {idx+1 < props.result.tags.length && (
              <TableCell>
                <Typography variant="body1">{props.result.tags[idx+1]}</Typography>
              </TableCell>
            )}
          </TableRow>
        );
        isGrey = !isGrey;
      }
    });
    return tagArray;
  }

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
                  Residential multi-zone hydronic
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
                <Typography variant="body2">Simulation Time</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">
                  {props.result.simulationTime}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body2">Price Scenario</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">
                  {props.result.priceScenario}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow className={classes.grayed}>
              <TableCell>
                <Typography variant="body2">
                  Uncertainty Distribution
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">
                  {props.result.uncertaintyDistribution}
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
                <Typography variant="body1">
                  {props.result.resultUid}
                </Typography>
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
                <Typography variant="body2">Contact</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">
                  {props.result.accountEmail}
                </Typography>
              </TableCell>
            </TableRow>
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
            {/*flattenedProperties.length > 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography
                    variant="subtitle2"
                    className={classes.sectionHeader}
                  >
                    CONTROLLER PROPERTIES
                  </Typography>
                </TableCell>
              </TableRow>
            )*/}
            {/*flattenedProperties.map((pair, idx) => (
              <TableRow className={idx % 2 === 0 ? classes.grayed : ''}>
                <TableCell>
                  <Typography variant="body2">
                    {camelCaseToTitleCaseWithSpaces(pair[0])}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{pair[1]}</Typography>
                </TableCell>
              </TableRow>
            ))*/}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
