import React, {useEffect} from 'react';
import clsx from 'clsx';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
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
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Data, createRows, Order, stableSort, HeadCell, getComparator} from '../Lib/TableHelpers';

const headCells: HeadCell[] = [
  {
    id: 'buildingType',
    numeric: false,
    disablePadding: true,
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
  {
    id: 'isShared',
    numeric: false,
    disablePadding: false,
    label: 'Shared',
  },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{'aria-label': 'select all results'}}
            color="default"
            style={{
              color: '#078b75',
            }}
          />
        </TableCell>
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
  numSelected: number;
  totalResults: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const {numSelected, totalResults} = props;

  return (
    <Toolbar className={clsx(classes.root)}>
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="h6"
          component="div"
        >
          {numSelected} Selected Results
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {totalResults} Total Results
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
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
    button: {
      justifyContent: 'center',
      padding: '0 16px 0 16px',
      margin: '0 8px 0 8px',
      backgroundColor: 'rgb(0, 150, 136)',
      color: 'white',
    },
    headerCell: {
      fontWeight: 'bold',
    },
    table: {
      minWidth: 750,
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
    tableRow: {
      '&$selected, &$selected:hover': {
        backgroundColor: 'rgb(146, 203, 197)',
      },
    },
    selected: {},
    checked: {},
    track: {},
    switchBase: {
      color: '#078b75',
      '&$checked': {
        color: '#078b75',
      },
      '&$checked + $track': {
        backgroundColor: '#078b75',
      },
    },
  })
);

// type the props here.
// results - list of results from the server
// displayResult() - method to show the result detail modal
export default function DashboardResultsTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('dateRun');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [rows, setRows] = React.useState<Data[]>([]);

  const [checked, setChecked] = React.useState<boolean>(false);

  // set the rows from the results that we get
  useEffect(() => {
    setRows(createRows(props.results));
  }, [props]);

  useEffect(() => {
    setRows(rows);
    setChecked(false);
  }, [checked]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map(r => r.resultUid);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleCheckboxClick = (
    event: React.MouseEvent<unknown>,
    uid: string
  ) => {
    event.stopPropagation();
    const selectedIndex = selected.indexOf(uid);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, uid);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    console.log('newSelected', newSelected);
    setSelected(newSelected);
  };

  const isSelected = (uid: string) => selected.indexOf(uid) !== -1;

  const handleRowClick = (event: React.MouseEvent<unknown>, result: Data) => {
    console.log('result', result);
    props.setSelectedResult(result);
  };

  const handleShareToggleClick = (
    event: React.MouseEvent<unknown>,
    result: Data
  ) => {
    // need to update the result that is shared. make a call to the API, and update the UI
    event.stopPropagation();

    var actualResult = rows[rows.indexOf(result)];
    actualResult.isShared = !actualResult.isShared;
    setChecked(true);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          totalResults={rows.length}
          numSelected={selected.length}
        />
        <div>
          <Button className={classes.button} variant="contained" size="small">
            Remove Test Results
          </Button>
          <Button className={classes.button} variant="contained" size="small">
            Download Test Results
          </Button>
        </div>
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
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.resultUid);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  var dateString = new Date(row.dateRun).toLocaleString();

                  return (
                    <TableRow
                      hover
                      onClick={event => handleRowClick(event, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.resultUid}
                      selected={isItemSelected}
                      classes={{selected: classes.selected}}
                      className={classes.tableRow}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{'aria-labelledby': labelId}}
                          color="default"
                          style={{
                            color: '#078b75',
                          }}
                          onClick={event =>
                            handleCheckboxClick(event, row.resultUid)
                          }
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        <Typography variant="body1">
                          {row.buildingType}
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
                      <TableCell>
                        <Switch
                          checked={row.isShared}
                          onClick={event => handleShareToggleClick(event, row)}
                          name="share switch"
                          inputProps={{'aria-label': 'secondary checkbox'}}
                          color="default"
                          classes={{
                            switchBase: classes.switchBase,
                            track: classes.track,
                            checked: classes.checked,
                          }}
                        />
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
