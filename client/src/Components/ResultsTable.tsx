import React, {useEffect} from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
  useTheme,
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
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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

// Helper function to split the label into main text and units
const parseHeaderLabel = (label: string): { main: string; unit: string | null } => {
  const matches = label.match(/^(.*?)\s*(\[.*?\])?$/);
  if (matches && matches[2]) {
    return { 
      main: matches[1].trim(), 
      unit: matches[2].trim() 
    };
  }
  return { main: label, unit: null };
};

function EnhancedTableHead(props: EnhancedTableProps) {
  const {classes, order, orderBy, onRequestSort} = props;
  const theme = useTheme();
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => {
          const { main, unit } = parseHeaderLabel(headCell.label);
          
          return (
            <TableCell
              key={headCell.id}
              align={'center'}
              padding={'none'}
              sortDirection={orderBy === headCell.id ? order : false}
              className={classes.headerCell}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                <div>
                  <span className={classes.headerLabel}>{main}</span>
                  {unit && <span className={classes.headerUnit}>{unit}</span>}
                </div>
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 3),
      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
    },
    filterContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    select: {
      margin: theme.spacing(2, 2, 2, 0),
      minWidth: '225px',
    },
    selectIcon: {
      fill: theme.palette.primary.main,
    },
    toggleContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      minWidth: '300px',
    },
    headerTitle: {
      fontWeight: 600,
      color: theme.palette.primary.main,
      letterSpacing: '0.02em',
    },
    switch: {
      '& .MuiSwitch-track': {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      },
      '& .MuiSwitch-thumb': {
        backgroundColor: '#ffffff',
      },
      '& .Mui-checked + .MuiSwitch-track': {
        backgroundColor: `${theme.palette.primary.main} !important`,
        opacity: 0.5,
      },
      '& .Mui-checked .MuiSwitch-thumb': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    switchLabel: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    titleAndFilterContainer: {
      display: 'flex',
      alignItems: 'center',
      flex: 1
    }
  })
);

const ColorButton = withStyles(theme => ({
  root: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
}))(Button);

const ColorSelect = withStyles(theme => ({
  root: {
    '& label': {
      color: theme.palette.primary.main,
    },
    '& label.Mui-focused': {
      color: theme.palette.primary.main,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}))(TextField);

interface EnhancedTableToolbarProps {
  buildingTypeFilterOptions: {
    [index: number]: string;
  };
  displayClear: boolean;
  buildingFilterValue: string;
  totalResults: number;
  updateBuildingFilter: (requestedBuilding: string) => void;
  viewMyResults?: boolean;
  onToggleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoggedIn?: boolean;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const {
    buildingTypeFilterOptions,
    displayClear,
    buildingFilterValue,
    totalResults,
    updateBuildingFilter,
    viewMyResults = false,
    onToggleChange,
    isLoggedIn = false
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
      <div className={classes.titleAndFilterContainer}>
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
      </div>
      
      <div className={classes.toggleContainer}>
        {isLoggedIn && onToggleChange && (
          <FormControlLabel
            control={
              <Switch
                checked={viewMyResults}
                onChange={onToggleChange}
                color="primary"
                className={classes.switch}
              />
            }
            label="Show My Results Only"
            className={classes.switchLabel}
          />
        )}
        <Typography variant="body2" style={{ marginLeft: '16px' }}>
          {totalResults} Total Results
        </Typography>
      </div>
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
    },
    headerCell: {
      fontWeight: 600,
      padding: theme.spacing(1.5),
    },
    headerLabel: {
      display: 'block',
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.2,
    },
    headerUnit: {
      display: 'block',
      fontSize: '0.75rem',
      fontWeight: 400,
      color: 'rgba(0, 0, 0, 0.6)',
      marginTop: theme.spacing(0.5),
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
  })
);

// type the props here.
// results - list of results from the server
// displayResult() - method to show the result detail modal
export default function ResultsTable(props: {
  results: any[];
  buildingTypes: any[];
  setSelectedResult: (result: any) => void;
  viewMyResults?: boolean;
  onToggleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoggedIn?: boolean;
}) {
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
          viewMyResults={props.viewMyResults}
          onToggleChange={props.onToggleChange}
          isLoggedIn={props.isLoggedIn}
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
