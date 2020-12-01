import React, {useEffect} from 'react';
import clsx from 'clsx';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

interface Data {
  id: number;
  uid: string;
  accountUsername: string;
  accountEmail: string;
  buildingTypeName: string;
  dateRun: Date;
  totalEnergy: number;
  thermalDiscomfort: number;
  aqDiscomfort: number; //indoor air quality discomfort
  energy: number; //total energy consumption
  cost: number; //total operations cost
  timeRatio: number;
  emissions: number;
  compTimeRatio: number;
  controllerProperties: JSON;
  testTimePeriod: string;
  controlStep: string;
  priceScenario: string;
  weatherForecastUncertainty: string;
}

const createDataFromResult = (result): Data => {
  return {
    id: result.id,
    uid: result.uid,
    accountUsername: result.account.name,
    accountEmail: result.account.email,
    buildingTypeName: result.buildingType.name,
    dateRun: result.dateRun,
    totalEnergy: result.energyUse,
    thermalDiscomfort: result.thermalDiscomfort,
    aqDiscomfort: result.iaq,
    energy: result.energyUse,
    cost: result.cost,
    timeRatio: result.timeRatio,
    emissions: result.emissions,
    compTimeRatio: result.timeRatio,
    controllerProperties: result.controllerProperties,
    testTimePeriod: result.testTimePeriod,
    controlStep: result.controlStep,
    priceScenario: result.priceScenario,
    weatherForecastUncertainty: result.weatherForecastUncertainty,
  };
};

const createRows = (results): Data[] => {
  let rows: Data[] = [];
  if (!results || !Array.isArray(results) || results.length == 0) {
    return rows;
  }
  results.forEach(result => {
    rows.push(createDataFromResult(result));
  });
  console.log('results 2', results, 'rows 2', rows);
  return rows;
};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: {[key in Key]: number | string},
  b: {[key in Key]: number | string}
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: 'buildingTypeName',
    numeric: false,
    disablePadding: false,
    label: 'Building Type',
  },
  {id: 'dateRun', numeric: false, disablePadding: false, label: 'Date Run'},
  {
    id: 'totalEnergy',
    numeric: true,
    disablePadding: false,
    label: 'Total Energy [kWh]',
  },
  {
    id: 'thermalDiscomfort',
    numeric: true,
    disablePadding: false,
    label: 'Thermal Discomfort [Kh]',
  },
  {
    id: 'aqDiscomfort',
    numeric: true,
    disablePadding: false,
    label: 'Indoor Air Quality Discomfort [ppmh]',
  },
  {
    id: 'cost',
    numeric: true,
    disablePadding: false,
    label: 'Total Operations Cost [$ or Euro]',
  },
  {
    id: 'emissions',
    numeric: true,
    disablePadding: false,
    label: 'Total CO2 emissions [kgCO2]',
  },
  {
    id: 'compTimeRatio',
    numeric: true,
    disablePadding: false,
    label: 'Computational Time Ratio [-]',
  },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {classes, order, orderBy, rowCount, onRequestSort} = props;
  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            //align={headCell.numeric ? 'right' : 'left'}
            align={'center'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            className={classes.headerCell}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    title: {
      flex: '1 1 100%',
    },
  })
);

interface EnhancedTableToolbarProps {
  totalResults: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const {totalResults} = props;

  return (
    <Toolbar className={clsx(classes.root)}>
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {totalResults} Total Results
      </Typography>
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    headerCell: {
      fontWeight: 'bold',
    },
    table: {
      minWidth: 750,
      padding: '0 0 0 16px',
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  })
);

// type the props here.
// results - list of results from the server
// displayResult() - method to show the result detail modal
export default function ResultsTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('dateRun');
  const [rows, setRows] = React.useState<Data[]>([]);

  // set the rows from the results that we get
  useEffect(() => {
    setRows(createRows(props.results));
  }, [props]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRowClick = (event: React.MouseEvent<unknown>, result: Data) => {
    // I think we just want to call a method that's passed in to handle the modal display
    // may need to call into a global state for the selected result here instead of
    // sending the result to the modal.
    props.setSelectedResult(result);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar totalResults={rows.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            //size={dense ? 'small' : 'medium'}
            size={'medium'}
            // aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  var dateString = new Date(row.dateRun).toLocaleString();

                  return (
                    <TableRow
                      hover
                      onClick={event => handleRowClick(event, row)}
                      role="checkbox"
                      tabIndex={-1}
                      key={row.uid}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="default"
                      >
                        <Typography variant="body1">
                          {row.buildingTypeName}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1">{dateString}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1">
                          {row.totalEnergy}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1">
                          {row.thermalDiscomfort}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1">
                          {row.aqDiscomfort}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1">{row.cost}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1">{row.emissions}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1">
                          {row.compTimeRatio}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
