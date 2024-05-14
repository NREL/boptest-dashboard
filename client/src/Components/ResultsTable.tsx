import React, {useEffect} from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
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
import {FilterRanges, FilterValues} from '../common/interfaces';
import {
  createRows,
  createTagOptions,
  Data,
  filterRows,
  getBuildingScenarios,
  getComparator,
  getFilterRanges,
  HeadCell,
  Order,
  setupFilters,
  stableSort,
} from '../Lib/TableHelpers';

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
    label: 'Total Energy [kWh/m^2]',
  },
  {
    id: 'thermalDiscomfort',
    numeric: true,
    disablePadding: false,
    label: 'Thermal Discomfort [Kh/zone]',
  },
  {
    id: 'aqDiscomfort',
    numeric: true,
    disablePadding: false,
    label: 'Indoor Air Quality Discomfort [ppmh/zone]',
  },
  {
    id: 'cost',
    numeric: true,
    disablePadding: false,
    label: 'Total Operations Cost [$ or Euro/m^2]',
  },
  {
    id: 'emissions',
    numeric: true,
    disablePadding: false,
    label: 'Total CO2 emissions [kgCO2/m^2]',
  },
  {
    id: 'peakElectricity',
    numeric: true,
    disablePadding: false,
    label: 'Peak Electrical Demand [kW/m2]',
  },
  {
    id: 'peakGas',
    numeric: true,
    disablePadding: false,
    label: 'Peak Gas Demand [kW/m2]',
  },
  {
    id: 'peakDistrictHeating',
    numeric: true,
    disablePadding: false,
    label: 'Peak District Heating Demand [kW/m2]',
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
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
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
            padding={headCell.disablePadding ? 'none' : 'normal'}
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
    filterContainer: {
      display: 'flex',
    },
    select: {
      marginTop: theme.spacing(2),
      minWidth: '225px',
    },
    selectIcon: {
      fill: '#078b75',
    },
  })
);

const ColorButton = withStyles(theme => ({
  root: {
    color: '#078b75',
    borderColor: '#078b75',
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
}))(Button);

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
  },
})(TextField);

interface EnhancedTableToolbarProps {
  buildingTypeFilterOptions: {
    [index: number]: string;
  };
  displayClear: boolean;
  buildingFilterValue: string;
  totalResults: number;
  updateBuildingFilter: (requestedBuilding: string) => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const {
    buildingTypeFilterOptions,
    displayClear,
    buildingFilterValue,
    totalResults,
    updateBuildingFilter,
  } = props;

  const selectProps = {
    classes: {icon: classes.selectIcon},
    MenuProps: {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
      getContentAnchorEl: null,
    },
  };

  const onBuildingTypeFilter =
    (clear = false) =>
    (event: React.MouseEvent<EventTarget>) => {
      updateBuildingFilter(clear ? '' : event.target.value);
    };

  return (
    <Toolbar className={classes.root}>
      <div className={classes.filterContainer}>
        <ColorSelect
          className={classes.select}
          label="Filter on Building Type"
          name="buildingType-filter"
          onChange={onBuildingTypeFilter()}
          select
          value={buildingFilterValue}
          variant="outlined"
          SelectProps={selectProps}
          size="small"
        >
          {buildingTypeFilterOptions.map(option => {
            return (
              <MenuItem key={`${option}-option`} value={option}>
                {option}
              </MenuItem>
            );
          })}
        </ColorSelect>
        {displayClear && (
          <ColorButton variant="outlined" onClick={onBuildingTypeFilter(true)}>
            Clear
          </ColorButton>
        )}
      </div>
      <Typography variant="h6" id="tableTitle" component="div">
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
  })
);

interface FilterToolbarProps {
  scenarioOptions: string[];
  tagOptions: string[];
  filterRanges: FilterRanges;
  filterValues: FilterValues;
  updateFilters: (requestedFilters: FilterValues) => void;
}

const FilterToolbar = (props: FilterToolbarProps) => {
  const classes = useFilterToolbarStyles();
  const {
    filterRanges,
    filterValues,
    scenarioOptions,
    tagOptions,
    updateFilters,
  } = props;

  const onRequestUpdateFilters = requestedFilters => {
    updateFilters(requestedFilters);
  };

  return (
    <Toolbar className={classes.root}>
      <FilterMenu
        filterRanges={filterRanges}
        filterValues={filterValues}
        onRequestFilters={onRequestUpdateFilters}
        scenarioOptions={scenarioOptions}
        tagOptions={tagOptions}
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
  const [buildingScenarios, setBuildingScenarios] = React.useState({});
  const [filterRanges, setFilterRanges] = React.useState({});
  const [displayFilters, setDisplayFilters] = React.useState(false);
  const [buildingTypeFilter, setBuildingTypeFilter] =
    React.useState<string>('');
  const [filters, setFilters] = React.useState({});
  const [tagOptions, setTagOptions] = React.useState<string[]>([]);

  // set the rows from the results that we get
  useEffect(() => {
    const allRows: Data[] = createRows(props.results);
    setRows(allRows);
    setFilteredRows(allRows);
    setBuildingScenarios(getBuildingScenarios(props.buildingTypes));
  }, [props.results, props.buildingTypes]);

  useEffect(() => {
    setFilterRanges(getFilterRanges(rows));
  }, [rows]);

  useEffect(() => {
    setFilters(setupFilters(filterRanges, []));
  }, [filterRanges]);

  useEffect(() => {
    if (buildingTypeFilter === '') {
      setDisplayFilters(false);
      setFilters(setupFilters(filterRanges, []));
    } else {
      setDisplayFilters(true);
      setFilters(
        setupFilters(
          filterRanges,
          Object.keys(buildingScenarios[buildingTypeFilter])
        )
      );
    }
  }, [buildingTypeFilter]);

  useEffect(() => {
    setFilteredRows(filterRows(rows, buildingTypeFilter, filters));
  }, [filters]);

  useEffect(() => {
    setTagOptions(createTagOptions(filteredRows));
  }, [filteredRows]);

  const handleUpdateFilters = requestedFilters => {
    setFilters(requestedFilters);
  };

  const handleUpdateBuildingFilter = requestedBuilding => {
    setBuildingTypeFilter(requestedBuilding);
  };

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
          buildingTypeFilterOptions={
            buildingScenarios && Object.keys(buildingScenarios)
          }
          displayClear={displayFilters}
          buildingFilterValue={buildingTypeFilter}
          totalResults={filteredRows.length}
          updateBuildingFilter={handleUpdateBuildingFilter}
        />
        {displayFilters && (
          <FilterToolbar
            scenarioOptions={buildingScenarios[buildingTypeFilter]}
            tagOptions={tagOptions}
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

                  const dateString = new Date(row.dateRun).toLocaleString();

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
                        padding="normal"
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
                          {row.totalEnergy.toFixed(4)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1">
                          {row.thermalDiscomfort.toFixed(4)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1">
                          {row.aqDiscomfort.toFixed(4)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1">
                          {row.cost.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1">
                          {row.emissions.toFixed(4)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1">
                          {row.peakElectricity.toFixed(4)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1">
                          {row.peakGas !== null
                            ? row.peakGas.toFixed(4)
                            : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1">
                          {row.peakDistrictHeating !== null
                            ? row.peakDistrictHeating.toFixed(4)
                            : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1">
                          {row.compTimeRatio.toFixed(4)}
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
