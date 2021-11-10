import React, {useEffect} from 'react';
import axios from 'axios';
import clsx from 'clsx';
import {createStyles, makeStyles, Theme, withStyles} from '@material-ui/core/styles';
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
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FilterListIcon from '@material-ui/icons/FilterList';
import {FilterMenu} from './FilterMenu';
import {FilterRanges, FilterValues, ScenarioOptions} from '../../../common/interfaces';
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
  stableSort
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

const toggleShared = (id: number, share: boolean) => {
  return axios.patch('/api/results/share', {id, share})
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
    filterContainer: {
      display: 'flex',
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

const ColorButton = withStyles((theme) => ({
  root: {
    color: '#078b75',
    borderColor: '#078b75',
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  }
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
  }
})(TextField);

interface EnhancedTableToolbarProps {
  buildingTypeFilterOptions: {
    [index: number]: string;
  };
  displayClear: boolean;
  filterRanges: FilterRanges;
  buildingFilterValue: string;
  numSelected: number;
  totalResults: number;
  updateBuildingFilter: (
    requestedBuilding: string
  ) => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const {
    buildingTypeFilterOptions,
    displayClear,
    filterRanges,
    buildingFilterValue,
    numSelected,
    totalResults,
    updateBuildingFilter
  } = props;

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

  const onBuildingTypeFilter = (clear: boolean = false) => (event: React.MouseEvent<EventTarget>) => {
    updateBuildingFilter(clear ? '' : event.target.value);
  };

  return (
    <Toolbar className={clsx(classes.root)}>
      <div className={clsx(classes.filterContainer)}>
        <ColorSelect
          className={clsx(classes.select)}
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
              <MenuItem key={`${option}-option`} value={option}>{option}</MenuItem>
            );
          })}
        </ColorSelect>
        {displayClear && (<ColorButton variant="outlined" onClick={onBuildingTypeFilter(true)}>Clear</ColorButton>)}
      </div>
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
  tagOptions: string[];
  filterRanges: FilterRanges;
  filterValues: FilterValues;
  updateFilters: (
    requestedFilters: FilterValues
  ) => void;
}

const FilterToolbar = (props: FilterToolbarProps) => {
  const classes = useFilterToolbarStyles();
  const {filterRanges, filterValues, scenarioOptions, tagOptions, updateFilters} = props;

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
    button: {
      justifyContent: 'center',
      backgroundColor: 'rgb(0, 150, 136)',
      color: 'white',
    },
    downloadButtonContainer: {
      // width: '90%',
      display: 'flex',
      flexDirection: 'row-reverse',
      // margin: '0 auto'
      paddingRight: theme.spacing(2),
      paddingTop: theme.spacing(1),
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

  const [filteredRows, setFilteredRows] = React.useState<Data[]>([]);
  const [buildingScenarios, setBuildingScenarios]  = React.useState({});
  const [filterRanges, setFilterRanges] = React.useState({});
  const [displayFilters, setDisplayFilters] = React.useState(false);
  const [buildingTypeFilter, setBuildingTypeFilter] = React.useState<string>('');
  const [filters, setFilters] = React.useState({});
  const [tagOptions, setTagOptions] = React.useState<string[]>([]);

  useEffect(() => {
    let allRows: Data[] = createRows(props.results);
    setRows(allRows);
    setFilteredRows(allRows);
    setBuildingScenarios(getBuildingScenarios(props.buildingTypes));
  }, [props.results, props.buildingTypes]);

  useEffect(() => {
    // setRows(rows);
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
      setFilters(setupFilters(filterRanges, Object.keys(buildingScenarios[buildingTypeFilter])));
    }
  }, [buildingTypeFilter]);

  useEffect(() => {
    setFilteredRows(filterRows(rows, buildingTypeFilter, filters));
  }, [filters]);

  useEffect(() => {
    setTagOptions(createTagOptions(filteredRows));
  }, [filteredRows]);

  const handleUpdateFilters = (requestedFilters) => {
    setFilters(requestedFilters);
  }

  const handleUpdateBuildingFilter = (requestedBuilding) => {
    setBuildingTypeFilter(requestedBuilding);
  }

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
    toggleShared(result.id, !result.isShared)
      .then(() => props.updateResults())
  };

  const downloadResultsToCSV = () => {
    const rowsToDl = filteredRows.filter(row => selected.indexOf(row.id) !== -1);

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
      }
      traverse(obj);
      return [keys, values];
    }

    const headings = [getFlatKeyValPairFromObj(rowsToDl[0])[0]];
    const values = rowsToDl.map(row => getFlatKeyValPairFromObj(row)[1])
    const allData = [...headings, ...values];
  
    let csvContent = "data:text/csv;charset=utf-8," + allData.map(e => e.join(",")).join("\n");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          buildingTypeFilterOptions={buildingScenarios && Object.keys(buildingScenarios)}
          displayClear={displayFilters}
          filterRanges={filterRanges}
          buildingFilterValue={buildingTypeFilter}
          totalResults={filteredRows.length}
          numSelected={selected.length}
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
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
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

                  var dateString = new Date(row.dateRun).toLocaleString();

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
                          color="default"
                          style={{
                            color: '#078b75',
                          }}
                          onClick={event =>
                            handleCheckboxClick(event, row.id)
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
