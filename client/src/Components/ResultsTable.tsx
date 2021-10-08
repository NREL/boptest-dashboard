import React, {useEffect} from 'react';
import clsx from 'clsx';
import {createStyles, makeStyles, Theme, withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import {FilterMenu} from './FilterMenu';
import {FilterRanges, FilterValues, ScenarioOptions} from '../../../common/interfaces';
import {Data, createRows, Order, stableSort, HeadCell, getComparator, getBuildingScenarios, getFilterRanges, resetFilters, filterRows} from '../Lib/TableHelpers';

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
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {classes, order, orderBy, onRequestSort} = props;
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
      justifyContent: 'space-between',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    title: {
      // flex: '1 1 100%',
    },
    select: {
      marginTop: theme.spacing(2),
      minWidth: '225px',
    },
    selectIcon: {
      fill: '#078b75',
    }
  })
);

const ColorSelect = withStyles({
  root: {
    '& label': {
      color: '#078b75',
    },
    '& label.Mui-focused': {
      color: '#078b75',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#078b75',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#078b75',
      },
      '&:hover fieldset': {
        borderColor: '#078b75',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#078b75',
      },
    },
  }
})(TextField);

interface EnhancedTableToolbarProps {
  buildingTypeFilterOptions: {
    [index: number]: string;
  };
  filterValues: FilterValues;
  totalResults: number;
    updateFilters: (
    requestedFilters: FilterValues
  ) => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const {buildingTypeFilterOptions, filterValues, totalResults, updateFilters} = props;

  const selectProps = {
    classes: { icon: classes.selectIcon },
    MenuProps: {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left'
      },
      getContentAnchorEl: null
    }
  };

  const onBuildingTypeFilter = (event) => {
    const newFilter = {
      ...filterValues,
      buildingType: event.target.value,
    }
    updateFilters(newFilter);
  };

  return (
    <Toolbar className={clsx(classes.root)}>
      <ColorSelect
        className={clsx(classes.select)}
        label="Filter on Building Type"
        name="buildingType-filter"
        onChange={onBuildingTypeFilter}
        select
        value={filterValues && filterValues.buildingType ? filterValues.buildingType : ""}
        variant="outlined"
        SelectProps={selectProps}
        size="small"
      >
        <MenuItem key="buildingType-none-option" value="">none</MenuItem>
        {buildingTypeFilterOptions.map(option => {
          return (
            <MenuItem key={`${option}-option`} value={option}>{option}</MenuItem>
          );
        })}
      </ColorSelect>
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

const useFilterToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      justifyContent: 'space-between',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    title: {
      // flex: '1 1 100%',
    },
  })
);

interface FilterToolbarProps {
  scenarioOptions: ScenarioOptions;
  filterRanges: FilterRanges;
  filterValues: FilterValues;
  updateFilters: (
    requestedFilters: FilterValues
  ) => void;
}

const FilterToolbar = (props: FilterToolbarProps) => {
  const classes = useFilterToolbarStyles();
  const {filterRanges, filterValues, scenarioOptions, updateFilters} = props;

  const onRequestUpdateFilters = (requestedFilters) => {
    updateFilters(requestedFilters);
  };

  return (
    <Toolbar className={clsx(classes.root)}>
      <FilterMenu
        filterRanges={filterRanges}
        filterValues={filterValues}
        onRequestFilters={onRequestUpdateFilters}
        scenarioOptions={scenarioOptions}
      />
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
  const [filteredRows, setFilteredRows] = React.useState<Data[]>([]);
  const [buildingScenarios, setBuildingScenarios]  = React.useState({});
  const [filterRanges, setFilterRanges] = React.useState({});
  const [displayFilters, setDisplayFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({});

  // set the rows from the results that we get
  useEffect(() => {
    let allRows: Data[] = createRows(props.results);
    setRows(allRows);
    setFilteredRows(allRows);
    setBuildingScenarios(getBuildingScenarios(props.buildingTypes));
  }, [props]);

  useEffect(() => {
    setFilterRanges(getFilterRanges(rows));
  }, [rows]);

  useEffect(() => {
    setFilters(resetFilters(filterRanges, props.buildingTypes));
  }, [filterRanges]);

  useEffect(() => {
    setFilteredRows(filterRows(rows, filters));
  }, [filters]);

  const handleUpdateFilters = (requestedFilters) => {
    if (requestedFilters.buildingType === '') {
      setDisplayFilters(false);
      setFilters(resetFilters(filterRanges, props.buildingTypes));
    } else {
      setDisplayFilters(true);
      setFilters(requestedFilters);
    }
  }

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
        <EnhancedTableToolbar
          buildingTypeFilterOptions={buildingScenarios && Object.keys(buildingScenarios)}
          filterValues={filters}
          totalResults={filteredRows.length}
          updateFilters={handleUpdateFilters}
        />
        {displayFilters && (
          <FilterToolbar
            scenarioOptions={buildingScenarios[filters.buildingType]}
            filterRanges={filterRanges}
            filterValues={filters}
            updateFilters={handleUpdateFilters}
          />
        )}
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
            />
            <TableBody>
              {stableSort(filteredRows, getComparator(order, orderBy))
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
