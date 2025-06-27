import React, {useEffect} from 'react';
import axios from 'axios';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
  useTheme,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
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
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {FilterMenu} from './FilterMenu';
import {FilterRanges, FilterValues} from '../../common/interfaces';
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

const toggleShared = (id: number, share: boolean) => {
  return axios.patch('/api/results/share', {id, share});
};

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
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const theme = useTheme();
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead style={{ borderSpacing: '0 !important' }}>
      <TableRow style={{ borderCollapse: 'collapse' }}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{'aria-label': 'select all results'}}
            color="primary"
          />
        </TableCell>
        {headCells.map(headCell => {
          const { main, unit } = parseHeaderLabel(headCell.label);
          
          return (
            <TableCell
              key={headCell.id}
              align={'center'}
              padding={'none'}
              sortDirection={orderBy === headCell.id ? order : false}
              className={`${classes.headerCell} ${classes.stickyHeader}`}
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
      minHeight: '56px', /* Fixed minimum height for the toolbar */
    },
    /* Special styling for filter placeholder label */
    filterPlaceholder: {
      color: theme.palette.text.secondary,
      paddingLeft: '14px',
      paddingRight: '60px', /* Extra padding to prevent overlap */
      display: 'inline-block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: 'calc(100% - 80px)', /* Reduced width to make room for arrow */
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      left: 0,
      pointerEvents: 'none'
    },
    filterContainer: {
      display: 'flex',
      alignItems: 'center', /* Center items vertically */
      height: '56px', /* Fixed height for container */
    },
    select: {
      margin: theme.spacing(0, 2, 0, 0),
      minWidth: '320px', /* Match width with filter row dropdowns */
      position: 'relative',
    },
    /* Use standard Material-UI icon */
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
    margin: theme.spacing(2, 0, 1, 2),
    height: '40px',
    alignSelf: 'flex-start',
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
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      paddingRight: '50px !important', // More space for the dropdown arrow
    },
    '& .MuiInputLabel-outlined': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '90%'
    },
    // Position the select icon farther right
    '& .MuiSelect-icon': {
      right: '12px',
      position: 'absolute',
    },
    // Make sure the label doesn't overlap with dropdown icon
    '& .MuiInputLabel-outlined': {
      maxWidth: 'calc(100% - 60px)',
    }
  },
}))(TextField);

interface EnhancedTableToolbarProps {
  buildingTypeFilterOptions: {
    [index: number]: string;
  };
  displayClear: boolean;
  buildingFilterValue: string;
  numSelected: number;
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
    numSelected,
    totalResults,
    updateBuildingFilter,
    viewMyResults = true,
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
      PaperProps: {
        style: { 
          maxWidth: '350px' 
        }
      }
    },
    // Use Material-UI's default icon positioning but with custom styles
    displayEmpty: true
  };

  const onBuildingTypeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      updateBuildingFilter(value === 'all' ? '' : value);
    };

  return (
    <Toolbar className={classes.root}>
      <div className={classes.titleAndFilterContainer}>
        <div className={classes.filterContainer}>
          <ColorSelect
            className={classes.select}
            label=""
            placeholder="Building Type"
            name="buildingType-filter"
            onChange={onBuildingTypeFilter}
            select
            value={buildingFilterValue || 'all'}
            defaultValue="all" /* Always show "All Building Types" by default */
            variant="outlined"
            SelectProps={{
              ...selectProps,
              renderValue: (value) => value === 'all' ? 'All Building Types' : value
            }}
            size="small"
          >
            {/* Use a single option for "All Building Types" */}
            <MenuItem value="all">All Building Types</MenuItem>
            {buildingTypeFilterOptions.map(option => {
              if (option === "All Building Types") return null; // Skip duplicate
              return (
                <MenuItem key={`${option}-option`} value={option}>
                  {option}
                </MenuItem>
              );
            })}
          </ColorSelect>
          {/* Clear button no longer needed with "All" option */}
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
          {numSelected > 0 ? `${numSelected} Selected` : `${totalResults} Total Results`}
        </Typography>
      </div>
    </Toolbar>
  );
};

const useFilterToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      justifyContent: 'space-between',
      padding: theme.spacing(0, 3), /* Match padding with other toolbars */
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
    button: {
      justifyContent: 'center',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    downloadButtonContainer: {
      display: 'flex',
      flexDirection: 'row-reverse',
      padding: theme.spacing(2),
      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    },
    headerCell: {
      fontWeight: 600,
      padding: theme.spacing(1.5),
      border: 'none',
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
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
      '& .MuiTableCell-root': {
        borderLeft: 'none',
        borderRight: 'none',
      },
    },
    tableContainer: {
      maxHeight: 'calc(100vh - 250px)', /* Adjust based on your layout */
      overflow: 'auto',
    },
    stickyHeader: {
      position: 'sticky',
      top: 0,
      backgroundColor: '#fff',
      zIndex: 10,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRight: 'none',
      '&::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        right: 0,
        height: '1px',
        bottom: 0,
        backgroundColor: 'rgba(224, 224, 224, 1)',
      }
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
    footer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(3),
      borderTop: '1px solid rgba(0, 0, 0, 0.08)',
      marginTop: 'auto',
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      fontWeight: 500,
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    tableRow: {
      '&$selected, &$selected:hover': {
        backgroundColor: theme.palette.primary.light,
      },
    },
    selected: {},
    checked: {},
    track: {},
    switchBase: {
      color: theme.palette.primary.main,
      '&$checked': {
        color: theme.palette.primary.main,
      },
      '&$checked + $track': {
        backgroundColor: theme.palette.primary.main,
      },
    },
  })
);

// type the props here.
// results - list of results from the server
// displayResult() - method to show the result detail modal
export default function DashboardResultsTable(props: {
  results: any[];
  buildingTypes: any[];
  setSelectedResult: (result: any) => void;
  updateResults: () => void;
  viewMyResults?: boolean;
  onToggleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoggedIn?: boolean;
}) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('dateRun');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [rows, setRows] = React.useState<Data[]>([]);

  const [checked, setChecked] = React.useState<boolean>(false);

  const [filteredRows, setFilteredRows] = React.useState<Data[]>([]);
  const [buildingScenarios, setBuildingScenarios] = React.useState({});
  const [filterRanges, setFilterRanges] = React.useState({});
  const [displayFilters, setDisplayFilters] = React.useState(false);
  const [buildingTypeFilter, setBuildingTypeFilter] =
    React.useState<string>('');
  const [filters, setFilters] = React.useState({});
  const [tagOptions, setTagOptions] = React.useState<string[]>([]);

  useEffect(() => {
    const allRows: Data[] = createRows(props.results);
    setRows(allRows);
    setFilteredRows(allRows);
    setBuildingScenarios(getBuildingScenarios(props.buildingTypes));
  }, [props.results, props.buildingTypes]);

  useEffect(() => {
    setChecked(false);
  }, [checked]);

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
    setSelected([]);
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

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = filteredRows.map(r => r.id);
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
    setSelected(newSelected);
  };

  const isSelected = (uid: string) => selected.indexOf(uid) !== -1;

  const handleRowClick = (event: React.MouseEvent<unknown>, result: Data) => {
    props.setSelectedResult(result);
  };

  const handleShareToggleClick = (
    event: React.MouseEvent<unknown>,
    result: Data
  ) => {
    event.stopPropagation();
    toggleShared(result.id, !result.isShared).then(() => props.updateResults());
  };

  const downloadResultsToCSV = () => {
    const rowsToDl = filteredRows.filter(
      row => selected.indexOf(row.id) !== -1
    );

    const getFlatKeyValPairFromObj = obj => {
      const keys = [];
      const values = [];
      const traverse = node => {
        for (const [key, val] of Object.entries(node)) {
          if (typeof val === 'object') {
            traverse(val);
          } else {
            keys.push(key);
            values.push(val);
          }
        }
      };
      traverse(obj);
      return [keys, values];
    };

    const headings = [getFlatKeyValPairFromObj(rowsToDl[0])[0]];
    const values = rowsToDl.map(row => getFlatKeyValPairFromObj(row)[1]);
    const allData = [...headings, ...values];

    const csvContent =
      'data:text/csv;charset=utf-8,' + allData.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');

    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
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
          numSelected={selected.length}
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
        <div className={classes.downloadButtonContainer}>
          <Button
            disabled={selected.length === 0}
            className={classes.button}
            variant="contained"
            size="medium"
            onClick={downloadResultsToCSV}
          >
            Download Selected (CSV)
          </Button>
        </div>
        <TableContainer className={classes.tableContainer}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            stickyHeader
            style={{ borderCollapse: 'collapse' }}
            /* Override with a direct CSS rule to remove vertical lines in header */
            classes={{
              root: classes.table
            }}
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredRows.length}
            />
            <TableBody>
              {stableSort(filteredRows, getComparator(order, orderBy))
                //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  const dateString = new Date(row.dateRun).toLocaleString();

                  return (
                    <TableRow
                      hover
                      onClick={event => handleRowClick(event, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      classes={{selected: classes.selected}}
                      className={classes.tableRow}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{'aria-labelledby': labelId}}
                          color="primary"
                          onClick={event => handleCheckboxClick(event, row.id)}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
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
                      <TableCell>
                        <Switch
                          checked={row.isShared}
                          onClick={event => handleShareToggleClick(event, row)}
                          name="share switch"
                          inputProps={{'aria-label': 'secondary checkbox'}}
                          color="primary"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <div className={classes.footer}>
          <Typography variant="body2">
            All results are from BOPTEST. Please visit the{' '}
            <a 
              href="https://ibpsa.github.io/project1-boptest/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={classes.link}
            >
              BOPTEST Homepage
            </a>{' '}
            to learn more.
          </Typography>
        </div>
      </Paper>
    </div>
  );
}
